import { FormControl } from '@angular/forms';
import { StatusUpload } from './status-upload';
import { UppyFile } from '@uppy/core';

export interface Exercise {
  name: string;
  description: string;
  videoFile: File | null;
  videoUrl?: string;
}

export interface ExerciseFormControls {
  id: FormControl<number>;
  name: FormControl<string>;
  description?: FormControl<string>;
  file: FormControl<UppyFile | null>;
  url: FormControl<string>;
  uppyFileId: FormControl<string | null>;
  retryUpload: FormControl<boolean>;
  upload: FormControl<boolean>;
  uploadStatus: FormControl<StatusUpload>;
  s3Key: FormControl<string>;
}
