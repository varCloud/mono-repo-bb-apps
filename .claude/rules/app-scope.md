# Alcance de cambios — athlete vs creator

Antes de implementar cualquier cambio, identificar si afecta a ambas apps o solo a una.

- Si el cambio toca `libs/` (shared, core, ui) **y** podría alterar el comportamiento de ambas apps, **preguntar primero** en qué app(s) debe aplicarse antes de proceder.
- Si el cambio es solo dentro de `apps/athlete/` o `apps/creator/`, proceder sin preguntar.
- Si el usuario ya especificó la app en su mensaje, proceder directamente.
