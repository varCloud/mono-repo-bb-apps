# Estructura de archivos nueva

Al crear un nuevo feature seguir la estructura:

```
apps/{app}/src/app/features/{feature}/
├── {feature}.routes.ts
└── pages/
    └── {page}/
        ├── {page}.component.ts
        ├── {page}.component.html
        └── {page}.component.scss
```

- Componentes reutilizables → `libs/ui/src/lib/components/`
- Servicios de dominio → `libs/shared/services/{domain}/`
- Servicios core (auth, sesión, push) → `libs/core/services/`
