import { Component, OnInit, input } from '@angular/core';
import { ErrorsMessagesService } from '@monorepo-bb-app/shared';
import { AbstractControl } from '@angular/forms';
import { customMessage } from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  imports: [TranslateModule],
})
export class ErrorMessageComponent implements OnInit {
  control = input.required<AbstractControl>();
  customMessages = input<customMessage | null>(null);
  class = input<string>('');

  constructor(private errorsMessagesService: ErrorsMessagesService) {}

  ngOnInit(): void {}

  get errorMessages(): string[] {
    const errors = this.errorsMessagesService.getErrorMessage(
      this.control(),
      this.customMessages(),
    );
    return errors ? errors.split('<br />') : [];
  }
}
