# Body Booster - Documentación del Proyecto

**Última actualización:** 27 de enero de 2026

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Base de Datos](#base-de-datos)
6. [Backend - NestJS](#backend---nestjs)
7. [Frontend - Aplicaciones](#frontend---aplicaciones)
8. [Integración Stripe](#integración-stripe)
9. [API REST](#api-rest)
10. [Modelos Principales](#modelos-principales)
11. [Servicios Clave](#servicios-clave)
12. [Variables de Entorno](#variables-de-entorno)
13. [Información de Conexión](#información-de-conexión)
14. [Scripts de Desarrollo](#scripts-de-desarrollo)

---

## 📱 Descripción General

**Body Booster** es una aplicación móvil multiplataforma (iOS y Android) desarrollada como un **monorepo** con dos aplicaciones principales:

1. **Athlete App** - Aplicación para atletas/usuarios
2. **Creator App** - Aplicación para creadores de contenido/entrenadores

La plataforma permite a los usuarios:
- Explorar y realizar entrenamientos
- Suscribirse a creadores de contenido
- Gestionar pagos a través de Stripe
- Interactuar con otros usuarios (mensajes, calificaciones, favoritos)
- Acceder a contenido de fitness personalizado

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Monorepo

```
mono-repo-bb-apps/
├── apps/                  # Aplicaciones principales
│   ├── athlete/          # App para atletas (Ionic + Angular)
│   └── creator/          # App para creadores (Ionic + Angular)
├── libs/                 # Librerías compartidas
│   ├── core/            # Servicios core y guards
│   ├── shared/          # Modelos, servicios, componentes compartidos
│   ├── ui/              # Componentes UI reutilizables
│   └── utils/           # Utilidades generales
├── files-build/         # Archivos para build (Android/iOS)
└── scripts/             # Scripts de sincronización
```

### Patrón de Desarrollo

- **Framework Frontend:** Angular 20.2 + Ionic 8.6
- **Compilador:** TypeScript
- **Build System:** Nx (Monorepo Management)
- **Plataformas Nativas:** Capacitor 7.2
- **Herramienta de Construcción Nativa:** Gradle (Android), CocoaPods (iOS)

---

## 🛠️ Stack Tecnológico

### Frontend - Mobile
```json
{
  "Angular": "~20.2.0",
  "Ionic": "^8.6.1",
  "Capacitor": "^7.2.0",
  "TypeScript": "~5.6.0",
  "RxJS": "~7.8.0",
  "NgxTranslate": "^16.0.4",
  "Swiper": "^11.2.10",
  "Stripe JS": "^7.9.0"
}
```

### Backend (Referencia)
```
NestJS - Framework de backend
MySQL - Base de datos
Stripe - Pasarela de pagos
TypeORM - ORM para base de datos
```

### Herramientas Nativas
```
Capacitor Plugins:
  - Camera
  - FileSystem
  - Network
  - Keyboard
  - LocalNotifications
  - PushNotifications
  - ScreenOrientation
  - Share
  - Browser
  - SocialLogin
```

### Librerías Adicionales
```
- ngx-mask: Máscaras de entrada
- ng2-pdf-viewer: Visualización de PDFs
- plyr: Reproductor de video
- Uppy: Carga de archivos (AWS S3)
- bson-objectid: Generación de IDs
```

---

## 📁 Estructura de Carpetas

### Apps

#### **apps/athlete/**
```
athlete/
├── android/              # Proyecto Android Gradle
├── assets/              # Recursos (imágenes, íconos)
├── public/              # Archivos públicos
├── src/
│   ├── index.html       # HTML principal
│   ├── main.ts          # Punto de entrada
│   ├── styles.scss      # Estilos globales
│   └── app/             # Componentes de la app
├── capacitor.config.ts  # Configuración Capacitor
├── project.json         # Configuración Nx
└── tsconfig.json
```

#### **apps/creator/**
Estructura similar a athlete, configurada para creadores

### Libs

#### **libs/shared/**
```
shared/
├── assets/              # Recursos compartidos
├── constants/           # Constantes de la app
├── directives/          # Directivas Angular
├── environment/         # Configuración de entorno
├── guards/             # Guards de enrutamiento
├── helpers/            # Funciones auxiliares
├── models/             # Interfaces y tipos TypeScript
├── pipes/              # Pipes personalizados
├── scss/               # Estilos compartidos
├── services/           # Servicios HTTP
│   ├── catalogos/      # Catálogos (categorías, dificultades, etc)
│   ├── errors-msg/     # Manejo de errores
│   ├── otp/            # Servicio de OTP
│   ├── stripe/         # Integración Stripe
│   ├── suscription/    # Gestión de suscripciones
│   ├── workout/        # Gestión de entrenamientos
│   └── ...otros/
└── index.ts            # Exports públicos
```

#### **libs/core/**
```
core/
├── directives/         # Directivas (ej: profile-color)
├── guard/             # Guards de autenticación
├── interceptors/      # Interceptores HTTP
├── models/            # Modelos específicos
├── services/          # Servicios core
└── index.ts
```

#### **libs/ui/**
```
ui/
└── src/lib/
    └── components/     # Componentes UI reutilizables
```

---

## 💾 Base de Datos

### Conexión MySQL

**Nombre de Conexión:** `body-boster`

### Información de Conexión

- **Host (Producción):** Via API de Render
- **Host (Local):** localhost
- **Puerto (Estándar):** 3306
- **Base de Datos:** body-boster

### Acceso Desde la Aplicación

La aplicación se conecta a través de los endpoints de la API REST del backend NestJS:

```
Producción: https://bb-api-y0vm.onrender.com/api/v1
Local:      http://localhost:3000/api/v1
```

### Tablas Principales

Basándose en los modelos y endpoints de la API:

| Tabla | Descripción |
|-------|-------------|
| users | Usuarios del sistema |
| subscriptions | Suscripciones activas |
| workouts | Entrenamientos |
| categories | Categorías de ejercicio |
| messages | Mensajes entre usuarios |
| payment_methods | Métodos de pago Stripe |
| billing_cycles | Ciclos de facturación |
| workout_ratings | Calificaciones de entrenamientos |
| workout_likes | Likes en entrenamientos |
| creator_ratings | Calificaciones a creadores |
| user_goals | Objetivos personales del usuario |
| user_conversations | Conversaciones entre usuarios |

---

## 🔌 Backend - NestJS

### Descripción

El backend está desarrollado en **NestJS** y se ejecuta en:

- **Producción:** https://bb-api-y0vm.onrender.com
- **Local:** http://localhost:3000

### Repositorio Separado

Este backend NO está incluido en este monorepo. Se encuentra en un repositorio separado.

### Contacto con el Backend

El frontend se conecta mediante:

```typescript
const API_URL = 'https://bb-api-y0vm.onrender.com/api/v1'
// O localmente:
// const API_URL = 'http://localhost:3000/api/v1'
```

---

## 📱 Frontend - Aplicaciones

### Athlete App

**Puerto de desarrollo:** 4200 (por defecto)

**Configuración local dev:**
```bash
npm run dev:athlete:serve
# Se ejecuta en: http://192.168.1.6:3000
```

**Sincronización con dispositivo:**
```bash
npm run dev:athlete:celular
# Ejecuta en dispositivo Android con live reload
```

**Build para Android:**
```bash
npm run athlete:sync
# Sincroniza Capacitor y abre Android Studio
```

### Creator App

**Puerto de desarrollo:** 4200 (por defecto)

**Configuración local dev:**
```bash
npm run dev:creator:serve
# Se ejecuta en: http://192.168.1.6:3002
```

**Sincronización con dispositivo:**
```bash
npm run dev:creator:celular
```

**Build para Android:**
```bash
npm run creator:sync
```

### Emulador iOS

Para ejecutar en emulador iOS:

```bash
npm run ios:emulator-creator    # Creator en iOS
npm run ios:emulator-athlete    # Athlete en iOS
```

---

## 💳 Integración Stripe

### Configuración General

**Proveedor:** Stripe (Procesamiento de pagos)

**Clave Publicable (Test):**
```
pk_test_51RYEfqPJwPYM8uTUSzJynUl2wpW3QZu5MshEneuaIwPnkPKz0L1tD6jISeB1ICgGS5zW7UGbVZ8ssJKXSuVM2IYK00SBjAS5mS
```

### Ubicación del Servicio Stripe

**Archivo:** `libs/shared/services/stripe/stripe.service.ts`

### Funcionalidades Principales

#### 1. **Inicialización de Stripe**
```typescript
async initStripe() {
  this.stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);
}
```

#### 2. **Setup Intents** (Configurar métodos de pago)
```typescript
getSetupIntents(customerId: string)
// GET /user/{customerId}/setup-intents
```

#### 3. **Account Link** (Onboarding de creadores)
```typescript
getAccountLink(userId: number)
// GET /user/{userId}/create-link-onboarding
// Abre browser con formulario de Stripe Connect
```

#### 4. **Métodos de Pago**
```typescript
getPaymentMethods(customerId: number)
// GET /user/{customerId}/payment-methods

setDefaultPaymentMethod(customerId: string, paymentMethodId: string)
// PUT /payments/customers/{customerId}/default-payment-method

deletePaymentMethod(paymentMethodId: string)
// DELETE /payments/payment-methods/{paymentMethodId}
```

#### 5. **Onboarding de Creadores**
```typescript
async openStripeOnboarding(idcreator: number)
// Abre Stripe Connect en navegador para completar onboarding
```

### Estados de Stripe en Usuario

La entidad `User` contiene:
- `stripeAccountId`: ID de la cuenta Stripe del usuario
- `stripeStatus`: Estado de la cuenta (ej: "active", "pending", "rejected")

### Webhooks Stripe

El backend maneja dos tipos de webhooks:

```
POST /api/v1/webhooks/stripe-customers
  - Eventos de clientes Stripe

POST /api/v1/webhooks/stripe-connected-accounts
  - Eventos de cuentas conectadas (para creadores)
```

---

## 🔌 API REST

### Base URLs

| Entorno | URL |
|---------|-----|
| Producción | https://bb-api-y0vm.onrender.com |
| Local | http://localhost:3000 |

### Documentación Swagger

| Entorno | URL |
|---------|-----|
| Producción | https://bb-api-y0vm.onrender.com/api-docs |
| Local | http://localhost:3000/api-docs |

### Endpoints Principales (v1)

#### **Autenticación**
```
POST   /api/v1/auth/login
GET    /api/v1/auth/check-auth-status
POST   /api/v1/auth/google
GET    /api/v1/auth/private
GET    /api/v1/auth/private2
GET    /api/v1/auth/private3
```

#### **Usuarios**
```
POST   /api/v1/user
GET    /api/v1/user
GET    /api/v1/user/{id}
PATCH  /api/v1/user/{id}
DELETE /api/v1/user/{id}
GET    /api/v1/user/{id}/create-link-onboarding
GET    /api/v1/user/{id}/account-register-payment-status
GET    /api/v1/user/{id}/subscription-status/{idCreator}
GET    /api/v1/user/{id}/setup-intents
GET    /api/v1/user/{id}/payment-methods
GET    /api/v1/user/{id}/suscriptions/{userType}
```

#### **Suscripciones**
```
POST   /api/v1/subscriptions
GET    /api/v1/subscriptions
GET    /api/v1/subscriptions/{id}
PATCH  /api/v1/subscriptions/{id}
DELETE /api/v1/subscriptions/{id}
```

#### **Pagos**
```
PUT    /api/v1/payments/customers/{customerId}/default-payment-method
DELETE /api/v1/payments/payment-methods/{paymentMethodId}
GET    /api/v1/payments/default-payment/{customerId}
```

#### **Entrenamientos (Workouts)**
```
POST   /api/v1/workout
GET    /api/v1/workout
GET    /api/v1/workout/{id}
PATCH  /api/v1/workout/{id}
DELETE /api/v1/workout/{id}
GET    /api/v1/workout/{id}/comments-stats
GET    /api/v1/workout/{id}/max-likes
GET    /api/v1/workout/{id}/creator
```

#### **Ratings de Entrenamientos**
```
POST   /api/v1/workout-ratings/{workoutAssetId}/rate
GET    /api/v1/workout-ratings/{workoutAssetId}/ratings
GET    /api/v1/workout-ratings/{workoutId}/rating-summary
DELETE /api/v1/workout-ratings/{workoutId}/rating
GET    /api/v1/workout-ratings/{workoutAssetId}/{userId}/rating-by-user
```

#### **Likes de Entrenamientos**
```
POST   /api/v1/workout-likes/{id}/like
GET    /api/v1/workout-likes/{id}/likes/count
GET    /api/v1/workout-likes/{id}/likes/user
GET    /api/v1/workout-likes/by-user/{id}
```

#### **Favoritos de Entrenamientos**
```
POST   /api/v1/workout-favorites/{workoutId}/user/{userId}/save
GET    /api/v1/workout-favorites/{workoutId}/user/{userId}/check
GET    /api/v1/workout-favorites/user/{userId}
GET    /api/v1/workout-favorites/user/ids/{userId}
GET    /api/v1/workout-favorites/{workoutId}/stats
DELETE /api/v1/workout-favorites/{workoutId}/user/{userId}
```

#### **Conversaciones**
```
POST   /api/v1/user-conversation/message
PATCH  /api/v1/user-conversation/message/{id}/status
GET    /api/v1/user-conversation/{userId}/{userType}/conversations
GET    /api/v1/user-conversation/conversation/{id}/messages
POST   /api/v1/user-conversation/conversation
```

#### **Carga de Archivos (S3)**
```
POST   /api/v1/upload/{userId}/start-upload
POST   /api/v1/upload/sign-part-url
POST   /api/v1/upload/complete-upload
POST   /api/v1/upload/abort-upload
POST   /api/v1/upload/get-file-view-url
POST   /api/v1/upload/{userId}/s3/multipart
GET    /api/v1/upload/{userId}/s3/multipart/{uploadId}/{partNumber}
POST   /api/v1/upload/{userId}/s3/multipart/{uploadId}/complete
```

#### **Catálogos** (Datos estáticos)
```
GET    /api/v1/catalogs/tools
GET    /api/v1/catalogs/all
GET    /api/v1/catalogs/account-status
GET    /api/v1/catalogs/billing-cycles
GET    /api/v1/catalogs/categories
GET    /api/v1/catalogs/worker-status
GET    /api/v1/catalogs/content-types
GET    /api/v1/catalogs/difficulty-levels
GET    /api/v1/catalogs/genders
GET    /api/v1/catalogs/location-types
GET    /api/v1/catalogs/subscription-status
GET    /api/v1/catalogs/tags
GET    /api/v1/catalogs/ticket-status
GET    /api/v1/catalogs/transaction-status
GET    /api/v1/catalogs/user-types
GET    /api/v1/catalogs/user-goals
GET    /api/v1/catalogs/faq-categories
```

#### **Notificaciones Push**
```
POST   /api/v1/push-notifications/update-token/{userId}
POST   /api/v1/push-notifications/send
```

#### **Otros**
```
GET    /api/v1/app-settings
GET    /api/v1/faqs
GET    /api/v1/creator-landing-page/{userId}/token
POST   /api/v1/mail
POST   /api/v1/mail/preview
```

---

## 📊 Modelos Principales

### User (Usuario)

```typescript
interface User {
  userId: number;
  userTypeId: number;              // Tipo de usuario (Athlete/Creator)
  firstName: string;
  lastName: string;
  email: string;
  genderId: number;
  registrationDate: Date;
  stripeAccountId: string;         // ID cuenta Stripe
  profileColor: string;
  bio: string;
  accountStatusId: number;         // Estado de cuenta
  profilePictureUrl: string;
  lastLogin: Date;
  updatedAt: Date;
  stripeStatus: string;            // Estado Stripe (active, pending, etc)
  categories: Category[];
  billingCycles: BillingCycle[];
  phone?: string;
  nickName?: string;
  isoCode?: string;
  gender?: string;
  birthdate?: string;
  age?: string;
  weight?: string;
  height?: string;
  levelId?: number;
  pushNotificationToken?: string;
  frontPageUrl?: string;
}
```

### BillingCycle (Ciclo de Facturación)

```typescript
interface BillingCycle {
  userBillingCycleId: number;
  billingCycleId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  active: number;
  stripePriceId: string;           // ID de precio Stripe
  amount: number;
  interval: number;
}
```

### Category (Categoría)

```typescript
interface Category {
  userCategoriesId: number;
  userId: number;
  categoryId: number;
  createdAt: Date;
  name: string;
  description: string;
}
```

---

## 🔧 Servicios Clave

### 1. **StripeService** (`libs/shared/services/stripe/stripe.service.ts`)

Gestiona toda la integración con Stripe:
- Inicialización de Stripe
- Setup Intents
- Account Links (onboarding)
- Métodos de pago
- Estados de onboarding

### 2. **Servicios de Catálogos** (`libs/shared/services/catalogos/`)

Obtienen datos estáticos del sistema (categorías, dificultades, etc.)

### 3. **Servicio OTP** (`libs/shared/services/otp/`)

Gestiona códigos OTP para:
- Verificación de teléfono
- Reset de contraseña

### 4. **Servicio de Suscripción** (`libs/shared/services/suscription/`)

Gestiona suscripciones de usuarios a creadores

### 5. **Servicio de Workout** (`libs/shared/services/workout/`)

Gestiona entrenamientos:
- CRUD de entrenamientos
- Filtros y búsqueda
- Likes y favoritos
- Calificaciones

---

## 🌍 Variables de Entorno

### Archivo: `libs/shared/environment/environment.ts`

```typescript
export const environment = {
  production: false,
  
  // Google OAuth
  IOS_GOOGLE_CLIENT_ID: '728116258989-oe719k2gf7ec5h0tob0v285bkertf0gt.apps.googleusercontent.com',
  WEB_GOOGLE_CLIENT_ID: '728116258989-p0r0ui0tg472scga7gb1o4nsfg7ejut1.apps.googleusercontent.com',
  
  // API Backend
  API_URL: 'https://bb-api-y0vm.onrender.com/api/v1',
  // Alternativa local: 'http://localhost:3000/api/v1',
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: 'pk_test_51RYEfqPJwPYM8uTUSzJynUl2wpW3QZu5MshEneuaIwPnkPKz0L1tD6jISeB1ICgGS5zW7UGbVZ8ssJKXSuVM2IYK00SBjAS5mS',
  
  // Almacenamiento
  MAX_SIZE_FILE_AWS_S3: 10 * 1024 * 1024 * 1024,  // 10 GB
  
  // Versión de app
  appVersion: '1.0.0-dev'
};
```

### Para Cambiar a Local

Descomenta la siguiente línea en `environment.ts`:

```typescript
// API_URL: 'http://localhost:3000/api/v1',
```

---

## 🔐 Información de Conexión

### Backend API

| Propiedad | Valor |
|-----------|-------|
| **Host (Producción)** | bb-api-y0vm.onrender.com |
| **Host (Local)** | localhost |
| **Puerto (Local)** | 3000 |
| **Base URL API** | `/api/v1` |
| **Protocolo** | HTTPS (producción) / HTTP (local) |
| **Documentación** | `/api-docs` |

### Base de Datos MySQL

| Propiedad | Valor |
|-----------|-------|
| **Nombre Conexión** | body-boster |
| **Tipo** | MySQL |
| **Puerto Estándar** | 3306 |
| **Acceso** | A través de API NestJS |

### Google OAuth

| Plataforma | Client ID |
|------------|-----------|
| iOS | 728116258989-oe719k2gf7ec5h0tob0v285bkertf0gt.apps.googleusercontent.com |
| Web | 728116258989-p0r0ui0tg472scga7gb1o4nsfg7ejut1.apps.googleusercontent.com |

### Stripe

| Propiedad | Valor |
|-----------|-------|
| **Ambiente** | Test/Sandbox |
| **Tipo Integración** | Stripe.js + Stripe Elements |
| **Modo Conexión** | Stripe Connect (para creadores) |
| **Webhooks** | `/api/v1/webhooks/*` |

---

## 📝 Scripts de Desarrollo

### Ejecución de Aplicaciones

```bash
# Servir ambas apps en paralelo
npm run start:all

# Servir solo la app de atletas
npm start:athlete

# Servir solo la app de creadores
npm run start:creator
```

### Desarrollo Móvil (Athlete)

```bash
# Servir con configuración de desarrollo en dispositivo real
npm run dev:athlete:serve

# Live reload en dispositivo Android
npm run dev:athlete:celular

# Live reload en emulador iOS
npm run ios:emulator-athlete

# Build y sincronización
npm run athlete:sync
```

### Desarrollo Móvil (Creator)

```bash
# Servir con configuración de desarrollo
npm run dev:creator:serve

# Live reload en dispositivo Android
npm run dev:creator:celular

# Live reload en emulador iOS
npm run ios:emulator-creator

# Build y sincronización
npm run creator:sync
```

### Build para Publicación

```bash
# Preparar para publicación (Athlete)
npm run prepare:publish:athlete

# Preparar para publicación (Creator)
npm run prepare:publish:creator
```

### Generación de Recursos

```bash
# Generar recursos Android (Athlete)
npm run resources:android:athlete

# Generar recursos Android (Creator)
npm run resources:android:creator

# Generar recursos iOS (Athlete)
npm run resources:ios:athlete

# Generar recursos iOS (Creator)
npm run resources:ios:creator
```

### Sincronización de Archivos

Estos scripts sincronizan archivos específicos del build para Android e iOS:

```bash
# Sincronizar archivos para Creator (Android)
npm run sync-files-creator:creator

# Sincronizar archivos para Creator (iOS)
npm run sync-files-creator:ios

# Sincronizar archivos para Athlete (Android)
npm run sync-files-creator:athlete

# Sincronizar archivos para Athlete (iOS)
npm run sync-files-athlete:ios
```

### Gestión de Proyectos Nx

```bash
# Ver grafo de dependencias del proyecto
npx nx graph

# Mostrar tareas disponibles para un proyecto
npx nx show project creator
npx nx show project athlete

# Listar todos los plugins instalados
npx nx list
```

---

## 🔄 Flujos de Trabajo Comunes

### 1. Agregar una Nueva Característica

1. Crear rama: `git checkout -b feature/my-feature`
2. Hacer cambios en `libs/shared` o `apps/athlete|creator`
3. Ejecutar tests y linting
4. Crear PR para revisión

### 2. Debugging de Stripe

1. Revisar `StripeService` en `libs/shared/services/stripe/`
2. Validar que `STRIPE_PUBLISHABLE_KEY` esté configurado
3. Verificar respuesta del endpoint de setup intents
4. Revisar logs en consola del navegador

### 3. Agregar un Nuevo Endpoint API

1. Verificar documentación en `/api-docs` del backend
2. Crear DTOs/interfaces en `libs/shared/models/`
3. Crear servicio HTTP en `libs/shared/services/`
4. Integrar en componentes

### 4. Testing en Dispositivo Real

```bash
# Athlete
npm run dev:athlete:celular

# Creator
npm run dev:creator:celular
```

---

## 📚 Recursos Útiles

### Documentación Externa

- [Angular 20 Documentation](https://angular.io)
- [Ionic Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com)
- [Stripe Documentation](https://stripe.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Nx Documentation](https://nx.dev)

### URLs del Proyecto

| Recurso | URL |
|---------|-----|
| API (Prod) | https://bb-api-y0vm.onrender.com |
| API Docs (Prod) | https://bb-api-y0vm.onrender.com/api-docs |
| API (Local) | http://localhost:3000 |
| API Docs (Local) | http://localhost:3000/api-docs |

---

## 🚀 Próximas Acciones Recomendadas

- [ ] Revisar configuración de base de datos MySQL "body-boster"
- [ ] Validar credenciales de Stripe en ambiente actual
- [ ] Verificar funcionalidad de OAuth con Google
- [ ] Testear flujo de carga de archivos a S3
- [ ] Validar webhooks de Stripe en ambiente local
- [ ] Documentar casos de uso específicos por role (Athlete/Creator)

---

## 📞 Contacto y Soporte

Para problemas o dudas sobre:
- **Frontend:** Revisar código en `apps/` y `libs/`
- **Backend:** Consultar documentación en `/api-docs`
- **Base de Datos:** Conexión "body-boster" en MySQL
- **Stripe:** Revisar logs y documentación oficial

---

**Última actualización:** 27 de enero de 2026  
**Versión del Proyecto:** 1.0.0-dev  
**Ambiente:** Desarrollo (con referencias a producción)
