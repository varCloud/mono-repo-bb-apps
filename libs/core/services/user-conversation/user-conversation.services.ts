import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, API_URLS , MessageModel , Message,Paginator ,PaginatorModel, UserConversationModel, UnreadSummary, MarkReadResult } from '@monorepo-bb-app/shared';
import { catchError, map, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserConversationService {
  private readonly BASE_URL = environment.API_URL;

  private readonly _unreadSummary = signal<UnreadSummary>({
    totalUnreadMessages: 0,
    conversationsWithUnread: 0,
    hasUnread: false,
  });
  public readonly unreadSummary$ = this._unreadSummary.asReadonly();

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

  createConversation(payload: any): Observable<any> {
    return this._http.post<any>(
      `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/conversation`,
      payload,
    );
  }

  public getUnreadSummary(): Observable<UnreadSummary> {
    return this._http
      .get<{ data: UnreadSummary }>(
        `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/unread-summary`,
      )
      .pipe(map((response) => response.data));
  }

  public markConversationAsRead(
    conversationId: number,
  ): Observable<MarkReadResult> {
    return this._http
      .patch<{ data: MarkReadResult }>(
        `${this.BASE_URL}${API_URLS.USER_CONVERSATION}/conversation/${conversationId}/read`,
        {},
      )
      .pipe(map((response) => response.data));
  }

  /** Refresca el resumen global de no leídos (badge del tab). */
  public refreshUnreadSummary(): void {
    this.getUnreadSummary()
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo unread-summary', error);
          return of(this._unreadSummary());
        }),
      )
      .subscribe((summary) => this._unreadSummary.set(summary));
  }

  /**
   * Deriva el resumen de no leídos a partir de la lista de conversaciones ya
   * cargada (que sí trae unreadCount/hasUnread). Sirve de fuente confiable para
   * el badge del tab aunque el endpoint /unread-summary no esté disponible.
   */
  public setUnreadSummaryFromConversations(conversations: UserConversationModel[]): void {
    const withUnread = conversations.filter((c) => c.hasUnread);
    this._unreadSummary.set({
      totalUnreadMessages: withUnread.reduce((acc, c) => acc + (c.unreadCount ?? 0), 0),
      conversationsWithUnread: withUnread.length,
      hasUnread: withUnread.length > 0,
    });
  }

  /**
   * Actualización optimista al abrir/leer una conversación: descuenta del
   * resumen los mensajes que tenía pendientes para que el badge se limpie de
   * inmediato, sin esperar al refresh del backend.
   */
  public registerConversationRead(removedUnread: number): void {
    if (!removedUnread || removedUnread <= 0) {
      return;
    }
    const current = this._unreadSummary();
    const conversationsWithUnread = Math.max(0, current.conversationsWithUnread - 1);
    this._unreadSummary.set({
      totalUnreadMessages: Math.max(0, current.totalUnreadMessages - removedUnread),
      conversationsWithUnread,
      hasUnread: conversationsWithUnread > 0,
    });
  }
}
