import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class PresignedS3Service {
  private uploadProgress = new BehaviorSubject<number>(0);

  public uploadProgress$ = this.uploadProgress.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Solicita una URL prefirmada para subir un archivo directamente a S3
   * @param fileName Nombre del archivo
   * @param contentType Tipo MIME del contenido
   * @param fileSize Tamaño del archivo en bytes
   */
  async getPresignedUrl(
    fileName: string,
    contentType: string,
    fileSize: number,
  ): Promise<string> {
    // Este endpoint debe ser configurado en tu servidor para generar URLs prefirmadas
    const response = await firstValueFrom(
      this.http.post<{ url: string }>(
        `${environment.API_URL}/s3/presigned-url`,
        {
          fileName,
          contentType,
          fileSize,
        },
      ),
    );

    return response.url;
  }

  /**
   * Sube un archivo directamente a S3 usando una URL prefirmada
   * @param presignedUrl URL prefirmada generada por el servidor
   * @param file Archivo a subir
   * @param contentType Tipo MIME del archivo
   */
  async uploadFileWithPresignedUrl(
    presignedUrl: string,
    file: File | Blob,
    contentType: string,
  ): Promise<string> {
    // Implementar un rastreador de progreso
    this.uploadProgress.next(0);

    const xhr = new XMLHttpRequest();

    // Configurar el rastreador de progreso
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        this.uploadProgress.next(percentComplete);
      }
    };

    // Crear una promesa para manejar la respuesta
    const uploadPromise = new Promise<string>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Extraer la URL del archivo del presignedUrl
          // normalmente será la URL sin los parámetros de consulta
          const fileUrl = presignedUrl.split('?')[0];
          resolve(fileUrl);
        } else {
          reject(
            new Error(
              `Error al subir archivo: ${xhr.status} ${xhr.statusText}`,
            ),
          );
        }
      };

      xhr.onerror = () => {
        reject(new Error('Error de red al subir archivo'));
      };
    });

    // Iniciar la solicitud
    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(file);

    return uploadPromise;
  }

  /**
   * Método combinado para obtener URL prefirmada y subir archivo
   * @param file Archivo a subir
   * @param fileName Nombre del archivo (opcional, se generará uno si no se proporciona)
   */
  async uploadFile(file: File | Blob, fileName?: string): Promise<string> {
    // Generar nombre de archivo si no se proporciona
    const finalFileName =
      fileName ||
      `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Determinar tipo de contenido
    const contentType =
      file instanceof File ? file.type : 'application/octet-stream';

    // Obtener URL prefirmada
    const presignedUrl = await this.getPresignedUrl(
      finalFileName,
      contentType,
      file.size,
    );

    // Subir archivo
    return this.uploadFileWithPresignedUrl(presignedUrl, file, contentType);
  }
}
