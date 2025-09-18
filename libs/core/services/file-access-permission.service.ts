import { Injectable } from '@angular/core';
import { Camera, CameraPermissionState } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class FileAccessPermissionService {
  /**
   * Revisa y solicita permisos para la cámara (imágenes y video)
   */
  async checkCameraPermission(): Promise<any> {
    let status = await Camera.checkPermissions();
    if (status.camera !== 'granted' || status.photos !== 'granted') {
      status = await Camera.requestPermissions({
        permissions: ['camera', 'photos'],
      });
    }
    return status;
  }

  /**
   * Revisa y solicita permisos para acceder al sistema de archivos (documentos)
   */
  async checkFilesystemPermission(): Promise<any> {
    let status = await Filesystem.checkPermissions();
    if (status.publicStorage !== 'granted') {
      status = await Filesystem.requestPermissions();
    }
    return status;
  }

  /**
   * Ejemplo de uso general para saber si tienes permisos para imágenes o documentos
   * @param type 'camera' | 'filesystem'
   */
  async hasPermission(type: 'camera' | 'filesystem'): Promise<boolean> {
    if (type === 'camera') {
      const status = await Camera.checkPermissions();
      return status.camera === 'granted' && status.photos === 'granted';
    }
    if (type === 'filesystem') {
      const status = await Filesystem.checkPermissions();
      return status.publicStorage === 'granted';
    }
    return false;
  }
}
