export interface CompleteResultUpload {
  url: string;
  fileId: number;
  location: string;
}

export class CompleteResultUploadModel implements CompleteResultUpload {
  url: string;
  fileId: number;
  location: string;

  constructor(data: CompleteResultUpload) {
    this.url = data.url;
    this.fileId = data.fileId;
    this.location = data.location;
  }
}
