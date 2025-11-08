import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { S3Service } from './s3/s3.service';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { Photo } from '@capacitor/camera';
import { CompleteResultUpload, environment, guessFileType } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly BASE_URL = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFile(
    filePathOrData: string,
    fileName: string,
    mimeType: string,
    typeImageBucket?: string,
  ): Promise<CompleteResultUpload> {
    let fileSize = 0;
    let isBase64 = false;
    try {
      console.log('uploadFile', fileName, mimeType);
      
      // Determinar si es base64 o ruta de archivo
      if (filePathOrData.startsWith('data:') || /^[A-Za-z0-9+/=]+$/.test(filePathOrData)) {
        isBase64 = true;
        // Si es base64, calcular el tamaño desde los datos
        const base64 = filePathOrData.includes('base64,') 
          ? filePathOrData.split('base64,')[1] 
          : filePathOrData;
        fileSize = Math.ceil((base64.length * 3) / 4);
      } else {
        try {
          // Es una ruta de archivo
          const processedPath = this.processFilePath(filePathOrData);
          console.log('processedPath', processedPath);
          const stat = await Filesystem.stat({ path: processedPath });
          fileSize = stat.size;
        } catch (error) {
          console.error('Error obteniendo información del archivo:', error);
          throw error;
        }
      }

      const payLoad = {
        fileName,
        mimeType,
        fileSize,
        ...(typeImageBucket && {
          typeImageBucket: typeImageBucket,
        }),
      };

      // 2. Iniciar subida multiparte en S3
      console.log('uploadId start multipart');
      const startMultipartUpload =
        await this.s3Service.startMultipartUpload(payLoad);
      console.log('uploadId', startMultipartUpload.uploadId);

      // 3. Subir en fragmentos
      let offset = 0;
      let partNumber = 1;
      const uploadedParts = [];

      // Preparar la ruta o los datos para la lectura
      const processedPath = isBase64 ? filePathOrData : this.processFilePath(filePathOrData);

      while (offset < fileSize) {
        const chunk = await this.readFileChunk(
          processedPath,
          offset,
          this.CHUNK_SIZE,
          isBase64
        );

        const partUrl = await this.s3Service.getSignedPartUrl(
          startMultipartUpload.uploadId,
          startMultipartUpload.fileName,
          partNumber,
          startMultipartUpload.s3Key,
        );

        const etag = await this.uploadChunk(partUrl, chunk);
        uploadedParts.push({ PartNumber: partNumber, ETag: etag });

        offset += chunk.byteLength;
        partNumber++;

        // Opcional: Emitir progreso
        const progress = Math.round((offset / fileSize) * 100);
        console.log(`Progreso: ${progress}%`);
      }

      // 4. Completar subida
      const completeResult: CompleteResultUpload =
        await this.s3Service.completeMultipartUpload(
          startMultipartUpload.uploadId,
          startMultipartUpload.fileName,
          uploadedParts,
          startMultipartUpload.s3Key,
        );

      return completeResult;
    } catch (error) {
      console.error('Error en subida:', JSON.stringify(error));
      throw error;
    }
  }

  private async readFileChunk(
    pathOrData: string,
    offset: number,
    length: number,
    isBase64: boolean = false
  ): Promise<ArrayBuffer> {
    let base64: string;
    
    if (isBase64) {
      // Si ya es base64, usarlo directamente
      base64 = pathOrData.includes('base64,') 
        ? pathOrData.split('base64,')[1] 
        : pathOrData;
    } else {
      // Si es una ruta de archivo, leerlo
      const result = await Filesystem.readFile({
        path: pathOrData,
      });
      base64 = result.data as string;
    }

    const binaryString = atob(base64);
    const totalLength = binaryString.length;
    const end = Math.min(offset + length, totalLength);
    const chunkArray = new Uint8Array(end - offset);

    for (let i = offset, j = 0; i < end; i++, j++) {
      chunkArray[j] = binaryString.charCodeAt(i);
    }

    return chunkArray.buffer;
  }

  private async uploadChunk(url: string, chunk: ArrayBuffer): Promise<string> {
    const response = await fetch(url, {
      method: 'PUT',
      body: chunk,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Error subiendo chunk: ${response.statusText}`);
    }

    return response.headers.get('ETag') || '';
  }

  /**
   * Procesa una ruta de archivo para asegurar que sea compatible con el API de Filesystem de Capacitor
   * Convierte URLs de Capacitor a rutas de archivo locales
   */
  private processFilePath(path: string): string {
    // Verifica si es una URL del tipo "_capacitor_file_"
    if (path.includes('_capacitor_file_')) {
      // Extrae la parte de la ruta después de "_capacitor_file_/"
      const match = path.match(/_capacitor_file_\/(.*)/);
      if (match && match[1]) {
        // Devuelve solo la parte de la ruta del sistema de archivos
        return match[1];
      }
    }
    return path;
  }

  public async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    const fileName = image.path!.split('/').pop() || `file_${Date.now()}`;
    const fileType = guessFileType(fileName);
    const result: CompleteResultUpload = await this.uploadFile(
      image.path!,
      fileName,
      fileType,
      'public',
    );
    return result;
  }
}
