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
    filePath: string,
    fileName: string,
    mimeType: string,
    typeImageBucket?: string,
  ): Promise<CompleteResultUpload> {
    let fileSize = 0;
    try {
      console.log('uploadFile', filePath, fileName, mimeType);
      // 1. Obtener información del archivo
      try {
        // Verificar si es una URL del capacitor y convertirla a una ruta de archivo local
        const processedPath = this.processFilePath(filePath);
        console.log('processedPath', processedPath);

        const stat = await Filesystem.stat({ path: processedPath });
        fileSize = stat.size;
      } catch (error) {
        console.error('Error obteniendo información del archivo:', error);
        throw error;
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

      // Procesar la ruta del archivo antes de leer fragmentos
      const processedPath = this.processFilePath(filePath);

      while (offset < fileSize) {
        const chunk = await this.readFileChunk(
          processedPath,
          offset,
          this.CHUNK_SIZE,
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
    path: string,
    offset: number,
    length: number,
  ): Promise<ArrayBuffer> {
    const result = await Filesystem.readFile({
      path,
    });

    // Capacitor returns base64 string, so decode it
    const base64 = result.data as string;
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
