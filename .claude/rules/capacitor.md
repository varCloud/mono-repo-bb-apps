# Capacitor — plugins nativos

- Cada plugin de Capacitor tiene su propio servicio wrapper en `libs/core/services/` o `libs/shared/services/`.
- No llamar a los plugins (`Camera`, `Share`, `Filesystem`, etc.) directamente desde componentes.
- Para fotos usar el helper `managePhotoToUpload` de `libs/shared/helpers/manage-photo-to-upload.ts`.
