
import { Photo } from "@capacitor/camera";
import { CompleteResultUploadModel } from "../models/complete-result-upload";
import { guessFileType } from "./file-functions";

  export async function proceessUploadPhoto(image: Photo): Promise<{
    fileData: string;
    fileName: string;
    fileType: string;
  }> {
    try {
      let fileName: string;
      let fileData: string;

      if (image.webPath) {
        // Caso web
        const blob = await (await fetch(image.webPath)).blob();
        fileData = await blobToBase64(blob);
        fileName = `file_${Date.now()}.${getFileExtFromMimeType(image.format)}`;
      } else if (image.base64String) {
        // Caso base64
        fileData = image.base64String;
        fileName = `file_${Date.now()}.${getFileExtFromMimeType(image.format)}`;
      } else if (image.path) {
        // Caso móvil - usar el path directamente
        fileData = image.path;
        fileName = image.path.split('/').pop() || `file_${Date.now()}`;
      } else {
        throw new Error('No valid image data found');
      }

      const fileType = guessFileType(fileName);

      return { fileData, fileName, fileType };
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  }

    export  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

   export function getFileExtFromMimeType(format: string = 'jpeg'): string {
    const mimeTypeMap: { [key: string]: string } = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'webp': 'webp'
    };
    return mimeTypeMap[format.toLowerCase()] || 'jpg';
  }