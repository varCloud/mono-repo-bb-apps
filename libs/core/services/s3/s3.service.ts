import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KEY_LOCALSTORAGE } from '@monorepo-bb-app/shared';
import {
  CompleteResultUpload,
  CompleteResultUploadModel,
} from '@monorepo-bb-app/shared';
import { environment } from '@monorepo-bb-app/shared';
import { LocalStorageService } from '../local-storage.service';
import { SesionService } from '../sesion.service';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private readonly BASE_URL = `${environment.API_URL}/upload`;
  constructor(
    private http: HttpClient,
    private _sesionService: SesionService,
  ) {}

  async startMultipartUpload(payload: {
    fileName: string;
    mimeType: string;
    fileSize: number;
    typeImageBucket?: string;
  }): Promise<any> {
    console.log('startMultipartUpload', payload.fileName, payload.mimeType);
    const userId = this._sesionService.user$()?.userId || 0;
    const response = await this.http
      .post<any>(`${this.BASE_URL}/${userId}/start-upload`, payload)
      .toPromise();

    if (!response || !response.uploadId) {
      throw new Error(
        'Failed to start multipart upload: uploadId is missing in response.',
      );
    }
    return response;
  }

  async getSignedPartUrl(
    uploadId: string,
    fileName: string,
    partNumber: number,
    s3Key: string,
  ): Promise<string> {
    const response = await this.http
      .post<{
        signedUrl: string;
      }>(`${this.BASE_URL}/sign-part-url`, {
        uploadId,
        fileName,
        partNumber,
        s3Key,
      })
      .toPromise();

    if (!response || !response.signedUrl) {
      throw new Error(
        'Failed to get signed part URL: signedUrl is missing in response.',
      );
    }
    return response.signedUrl;
  }

  async completeMultipartUpload(
    uploadId: string,
    fileName: string,
    parts: Array<{ PartNumber: number; ETag: string }>,
    s3Key: string,
  ): Promise<CompleteResultUpload> {
    const response = await this.http
      .post<CompleteResultUpload>(`${this.BASE_URL}/complete-upload`, {
        uploadId,
        fileName,
        parts,
        s3Key,
      })
      .toPromise();

    if (!response) {
      throw new Error(
        'Failed to complete multipart upload: response is missing.',
      );
    }
    return new CompleteResultUploadModel(response);
  }
}
