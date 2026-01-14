import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

export interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
  dialogTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  /**
   * Comparte contenido usando el diálogo nativo de compartir del dispositivo
   * @param options Opciones de compartir
   * @returns Promise que se resuelve cuando se comparte o se cancela
   */
  async share(options: ShareOptions): Promise<{ activityType?: string }> {
    try {
      const canShare = await Share.canShare();
      
      if (!canShare.value) {
        // Fallback: copiar al clipboard si no puede compartir
        await this.copyToClipboard(options.url);
        throw new Error('Share not available, copied to clipboard instead');
      }

      const result = await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Compartir',
      });

      return result;
    } catch (error) {
      console.error('Error sharing:', error);
      throw error;
    }
  }

  /**
   * Copia texto al portapapeles
   * @param text Texto a copiar
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await Clipboard.write({
        string: text
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw error;
    }
  }

  /**
   * Lee el contenido del portapapeles
   * @returns Contenido del portapapeles
   */
  async readFromClipboard(): Promise<string> {
    try {
      const { value } = await Clipboard.read();
      return value;
    } catch (error) {
      console.error('Error reading from clipboard:', error);
      throw error;
    }
  }

  /**
   * Verifica si el dispositivo puede compartir
   * @returns true si puede compartir
   */
  async canShare(): Promise<boolean> {
    try {
      const result = await Share.canShare();
      return result.value;
    } catch {
      return false;
    }
  }
}
