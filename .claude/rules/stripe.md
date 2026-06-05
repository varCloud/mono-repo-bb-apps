# Pagos — Stripe

- Toda la lógica de Stripe vive en `libs/shared/services/stripe/stripe.service.ts`.
- Usar `loadStripe()` en el constructor del servicio (no en los componentes).
- El flujo de onboarding abre la URL con `Browser.open()` de Capacitor.
- El estado de éxito/error se expone como `signal<boolean>`.
- **No instanciar `loadStripe()` fuera del servicio**.
