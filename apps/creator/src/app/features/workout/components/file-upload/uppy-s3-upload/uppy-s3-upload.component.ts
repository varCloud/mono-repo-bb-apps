/* global console */
import { Component, OnDestroy, AfterViewInit } from '@angular/core';

import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { environment } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-uppy-s3-upload',
  templateUrl: './uppy-s3-upload.component.html',
  styleUrls: ['./uppy-s3-upload.component.scss'],
})
export class UppyS3UploadComponent implements AfterViewInit, OnDestroy {
  private uppy!: Uppy;
  private readonly BASE_URL = `${environment.API_URL}/upload/75`;
  constructor() {}

  ngAfterViewInit() {
    // Uppy vanilla: inicialización y montaje manual
    const BASE_URL = this.BASE_URL;
    this.uppy = new Uppy({
      restrictions: {
        maxFileSize: environment.MAX_SIZE_FILE_AWS_S3,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
      },
      autoProceed: false,
      debug: true,
    })
      .use(Dashboard, {
        inline: true,
        target: '#uppy-dashboard',
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        height: 400,
      })
      .use(AwsS3Multipart, {
        companionUrl: this.BASE_URL,
        retryDelays: [0, 1000, 3000, 5000],
      });

    this.uppy.on('upload-error', (file: any, error: any, response: any) => {
      console.error('Error subiendo archivo:', file.name, error);
      if (response) {
        console.error('Respuesta del backend:', JSON.stringify(response));
      }
    });
    this.uppy.on('upload-retry', (_) => {
      console.log('Reintentando archivo:', _);
    });
  }

  ngOnDestroy() {
    if (this.uppy && typeof this.uppy.close === 'function') {
      this.uppy.close();
    }
  }
}
