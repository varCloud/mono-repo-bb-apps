# Plan de integración Front (Angular) — Novedades / mensajes no leídos

> Backend ya implementado en `bb-api` (módulo `user-conversation`). Este documento es el contrato + pasos de integración para el front Angular.

## Objetivo

Hoy el front depende de la **push notification** para enterarse de mensajes nuevos, y la push a veces falla. Estos endpoints dan un **fallback confiable** independiente de Firebase:

1. Mostrar en el **tab de Mensajes** un indicador de que hay novedad.
2. Indicar **qué conversaciones** tienen mensajes nuevos.
3. Listar conversaciones **ordenadas** poniendo primero las que tienen novedad.
4. **Limpiar** la novedad de forma confiable al abrir un chat.

La push se mantiene como complemento (camino rápido), pero ya no es la única fuente de verdad.

---

## Contrato de API

Todas las respuestas usan el envoltorio estándar:

```ts
interface ApiResponse<T> {
  status: boolean;
  mensaje: string;
  data: T;
}
```

Todos los endpoints requieren `Authorization: Bearer <JWT>`. El usuario se toma del token en los endpoints de resumen y de marcado.

### 1. Resumen de novedades (badge del tab)

```
GET /v1/user-conversation/unread-summary
```

`data`:

```ts
interface UnreadSummary {
  totalUnreadMessages: number;     // total de mensajes no leídos del usuario
  conversationsWithUnread: number; // nº de conversaciones con al menos 1 no leído
  hasUnread: boolean;              // true si hay cualquier novedad
}
```

Uso: pintar el punto/badge del tab. `hasUnread` para mostrar/ocultar; `totalUnreadMessages` o `conversationsWithUnread` para el número.

### 2. Listado de conversaciones (ordenado por novedad)

```
GET /v1/user-conversation/:userId/:userType/conversations?page=1&limit=10&search=
```

- `userType`: `1 = CREATOR`, `2 = ATHLETE` (enum `ENUM_TYPE_USER`).
- Ya viene **ordenado**: primero las de mayor `unreadCount`, luego por `lastMessageDate` desc.

`data`:

```ts
interface ConversationsResponse {
  conversations: ConversationItem[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

interface ConversationItem {
  userConversationId: number;
  lastMessageDate: string;          // ISO
  creatorUser: PublicUser;
  athleteUser: PublicUser;
  lastMessage: LastMessage | null;
  unreadCount: number;              // no leídos enviados por la otra persona
  hasUnread: boolean;               // unreadCount > 0  → pintar indicador
}

interface PublicUser {
  userId: number;
  firstName: string;
  profilePictureUrl: string | null;
  nickName: string | null;
}

interface LastMessage {
  messageId: number;
  sentDate: string;                 // ISO
  content: string;
}
```

Uso: pintar el indicador por conversación con `hasUnread` / `unreadCount`.

### 3. Marcar conversación como leída

```
PATCH /v1/user-conversation/conversation/:id/read
```

- `:id` = `userConversationId`. Sin body (el usuario sale del token).
- Marca como leídos solo los mensajes enviados por la **otra** persona.

`data`:

```ts
interface MarkReadResult {
  updatedMessages: number;
}
```

Uso: llamarlo **al abrir** una conversación.

---

## Pasos de integración en Angular

### Paso 1 — Modelos (`models/conversation.model.ts`)

Crear las interfaces `UnreadSummary`, `ConversationItem`, `PublicUser`, `LastMessage`, `MarkReadResult` (copiar de arriba).

### Paso 2 — Servicio (`services/conversation.service.ts`)

Agregar al servicio existente de mensajería:

```ts
private readonly base = `${environment.apiUrl}/v1/user-conversation`;

getUnreadSummary(): Observable<UnreadSummary> {
  return this.http
    .get<ApiResponse<UnreadSummary>>(`${this.base}/unread-summary`)
    .pipe(map(r => r.data));
}

getConversations(userId: number, userType: number, page = 1, limit = 10, search = '') {
  const params = new HttpParams()
    .set('page', page).set('limit', limit).set('search', search);
  return this.http
    .get<ApiResponse<ConversationsResponse>>(`${this.base}/${userId}/${userType}/conversations`, { params })
    .pipe(map(r => r.data));
}

markConversationAsRead(conversationId: number): Observable<MarkReadResult> {
  return this.http
    .patch<ApiResponse<MarkReadResult>>(`${this.base}/conversation/${conversationId}/read`, {})
    .pipe(map(r => r.data));
}
```

### Paso 3 — Estado global de novedades (`UnreadStore` / servicio singleton)

Un servicio con un `BehaviorSubject` para que el badge del tab y la lista reaccionen sin recargar:

```ts
private summary$ = new BehaviorSubject<UnreadSummary>({
  totalUnreadMessages: 0, conversationsWithUnread: 0, hasUnread: false,
});
readonly hasUnread$ = this.summary$.pipe(map(s => s.hasUnread));
readonly badgeCount$ = this.summary$.pipe(map(s => s.conversationsWithUnread));

refresh() {
  this.conversationService.getUnreadSummary().subscribe(s => this.summary$.next(s));
}
```

Llamar `refresh()`:
- Al arrancar la app (tras login).
- Al recibir una push de tipo `CHAT_MESSAGE`.
- Al volver la app a primer plano (resume).
- Tras `markConversationAsRead`.
- Con un **polling** ligero (ej. `interval(30_000)`) mientras la app está activa — este es el fallback cuando la push falla.

### Paso 4 — Badge en el tab de Mensajes

En el componente del tab bar:

```html
<ion-tab-button tab="mensajes">
  <ion-icon name="chatbubbles"></ion-icon>
  <ion-badge *ngIf="unreadStore.hasUnread$ | async" color="danger">
    {{ unreadStore.badgeCount$ | async }}
  </ion-badge>
</ion-tab-button>
```

### Paso 5 — Lista de conversaciones

- Consumir `getConversations(...)`: ya viene ordenada, no reordenar en el front.
- Pintar indicador por ítem:

```html
<ion-item *ngFor="let c of conversations">
  ...
  <ion-badge *ngIf="c.hasUnread" color="danger" slot="end">{{ c.unreadCount }}</ion-badge>
</ion-item>
```

- En `ionViewWillEnter` / al entrar a la lista, refrescar tanto la lista como el resumen.

### Paso 6 — Abrir conversación → marcar como leída

Al abrir el detalle del chat:

```ts
ngOnInit() {
  this.conversationService.markConversationAsRead(this.conversationId)
    .subscribe(() => {
      this.unreadStore.refresh();          // actualiza badge global
      // marcar localmente la conversación como leída en la lista cacheada
    });
}
```

Hacerlo **optimista**: poner `hasUnread = false` / `unreadCount = 0` en la lista local de inmediato y confirmar con la respuesta.

### Paso 7 — Integración con la push existente

El handler de push de `CHAT_MESSAGE` debe, además de mostrar la notificación:
- Llamar `unreadStore.refresh()`.
- Si el usuario está en la lista, recargar la primera página.
- Si está dentro de esa misma conversación, marcarla como leída.

Así la push acelera la actualización, pero el polling/refresh garantiza que la novedad aparezca aunque la push no llegue.

---

## Checklist de QA

- [ ] Con la app cerrada y push desactivada, al abrir Mensajes el badge refleja los no leídos (vía `unread-summary`).
- [ ] La conversación con más no leídos aparece arriba en la lista.
- [ ] Al abrir un chat, el indicador de esa conversación desaparece y el badge del tab disminuye.
- [ ] Mis propios mensajes no cuentan como no leídos para mí.
- [ ] `userType` correcto: como creador (1) y como atleta (2) ven sus respectivas conversaciones.
- [ ] El polling no dispara más de 1 request por intervalo y se pausa en background.

## Notas

- El indicador se deriva de `message_status_id` + `send_message_user_id`; el endpoint de marcar como leído es lo que mantiene los datos correctos. Si el front nunca llama a `mark-as-read`, todo seguirá apareciendo como no leído.
- No hay cambios de esquema; estos endpoints son aditivos y no rompen los contratos existentes (`conversations` solo ganó los campos `unreadCount` y `hasUnread`).
