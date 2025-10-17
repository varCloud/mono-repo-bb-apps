import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, API_URLS , MessageModel , Message,Paginator ,PaginatorModel, UserConversationModel } from '@monorepo-bb-app/shared';
import { catchError, map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserConversationService {
  private readonly BASE_URL = environment.API_URL;

  constructor(private _http: HttpClient) {}

  public message(payload: any) {
    return this._http.post<any>(
      `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/message`,
      payload,
    );
  }

  public getMessagesByConversartion(
    uri: string = '',
    conversationId: number,
    params: any = {},
  ): Observable<{ messages: Message[]; paginator: PaginatorModel }> {
    uri = `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/conversation/${conversationId}/messages${uri}`;

    return this._http
      .get(uri, { params: new HttpParams({ fromObject: params }) })
      .pipe(
        map((response: any) => {
          const result = {
            messages: [] as Message[],
            paginator: {} as PaginatorModel,
          };
          result.messages = response.data.messages.map(
            (msg: any) => new MessageModel(msg),
          );
          result.paginator = new PaginatorModel(response.data);
          return result;
        }),
      );
  }

  public getConversations(
    uri: string = '',
    userId: number,
    userTypeId: number,
    params: any = {},
  ): Observable<{ conversations: UserConversationModel[]; paginator: PaginatorModel }> {
    uri = `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/${userId}/${userTypeId}/conversations${uri}`;

    return this._http
      .get(uri, { params: new HttpParams({ fromObject: params }) })
      .pipe(
        map((response: any) => {
          const result = {
            conversations: [] as UserConversationModel[],
            paginator: {} as PaginatorModel,
          };
          result.conversations = response.data.conversations.map(
            (msg: any) => new UserConversationModel(msg),
          );
          result.paginator = new PaginatorModel(response.data);
          return result;
        }),
      );
  }
}
