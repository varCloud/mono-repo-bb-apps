import { Injectable } from '@angular/core';
import { environment } from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly APP_TAG = '[BB-APP]';
  private readonly NETWORK_TAG = '[NETWORK]';
  private readonly ERROR_TAG = '[ERROR]';
  private readonly WARNING_TAG = '[WARNING]';
  private readonly INFO_TAG = '[INFO]';

  constructor() {}

  network(message: string, data?: any) {
    if (!environment.production) {
      const formattedMessage = this.formatMessage(
        this.NETWORK_TAG,
        message,
        data,
      );
      // console.log(formattedMessage);
    }
  }

  error(message: string, error?: any) {
    const formattedMessage = this.formatMessage(this.ERROR_TAG, message, error);
    console.error(formattedMessage);
  }

  warning(message: string, data?: any) {
    if (!environment.production) {
      const formattedMessage = this.formatMessage(
        this.WARNING_TAG,
        message,
        data,
      );
      console.warn(formattedMessage);
    }
  }

  info(message: string, data?: any) {
    if (!environment.production) {
      const formattedMessage = this.formatMessage(this.INFO_TAG, message, data);
      console.log(formattedMessage);
    }
  }

  private formatMessage(tag: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `${this.APP_TAG}${tag} [${timestamp}] ${message}`;

    if (data) {
      if (typeof data === 'object') {
        try {
          return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
        } catch (e) {
          return `${baseMessage}\n${data}`;
        }
      }
      return `${baseMessage}\n${data}`;
    }

    return baseMessage;
  }
}
