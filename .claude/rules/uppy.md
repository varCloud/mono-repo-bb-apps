# Upload de archivos — Uppy + AWS S3

- Para subir archivos usar **Uppy** con el plugin `AwsS3Multipart`.
- Inicializar Uppy en `ngAfterViewInit()`, destruir en `ngOnDestroy()` usando el helper `destroyUppy` de `libs/shared/helpers/destroy-uppy.ts`.
- El dashboard se renderiza en un elemento con id `#uppy-dashboard` (inline).
- Configurar restricciones desde `environment.MAX_SIZE_FILE_AWS_S3`.
- **No usar** `<input type="file">` directo para uploads de contenido multimedia.

```typescript
ngAfterViewInit() {
  this.uppy = new Uppy({ restrictions: { maxFileSize: environment.MAX_SIZE_FILE_AWS_S3 } })
    .use(AwsS3Multipart, { ... })
    .use(Dashboard, { inline: true, target: '#uppy-dashboard' });
}

ngOnDestroy() {
  destroyUppy(this.uppy);
}
```
