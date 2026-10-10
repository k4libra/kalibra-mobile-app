# Kalibra Mobile App

App del estudiante de Kalibra (React Native): cursos e invitaciones, práctica adaptativa, progreso, historial y perfil.

> Estado actual: **integración HTTP con el contrato API v2**. Autenticación por cookie, cursos, invitaciones, práctica, progreso, historial y preferencias consumen la API. Los fixtures existen únicamente en tests.

## Stack

| Paquete | Versión |
| --- | --- |
| React Native | 0.87.1 |
| React | 19.2.3 |
| TypeScript | 6.0 |
| @react-navigation/native | 7.5.0 |
| @react-navigation/native-stack · bottom-tabs | 7.20.0 |
| react-native-screens | 4.28.0 |
| react-native-safe-area-context | 5.x |
| babel-plugin-module-resolver (alias `@/`) | 5.0.3 |

### Compatibilidad y versiones fijadas

- React Native 0.87 es muy reciente. Los `peerDependencies` de `react-native-screens` aceptan cualquier versión de React Native, así que la compatibilidad se valida compilando la app nativa (ver «Verificación nativa»).
- Si un build nativo falla por `react-native-screens`, baja a la última 4.x que compile y registra aquí la versión y el motivo:

| Paquete | Versión fijada | Motivo |
| --- | --- | --- |
| — | — | Sin downgrades: el build iOS compila con RN 0.87.1 + `react-native-screens` 4.28.0 (verificado 2026-10-08) |

- **Simulador iOS 27:** la app compila pero se cierra al abrir porque iOS 27 exige el ciclo de vida UIScene y la plantilla de RN 0.87 aún usa `AppDelegate` sin escenas (`UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`). Usa un simulador iOS 26.x hasta adoptar UIScene en `ios/Kalibra/AppDelegate.swift`.
- TypeScript 6 deprecó `baseUrl`: el alias `@/` usa solo `paths` en `tsconfig.json`.

## Fuentes e íconos

- Plus Jakarta Sans (Regular, Medium, SemiBold, Bold) y Material Symbols Rounded viven en `src/assets/fonts` y se enlazan con `react-native.config.js`.
- Tras agregar o cambiar una fuente: `npx react-native-asset`.
- Los nombres de archivo coinciden con el nombre PostScript para que funcionen igual en iOS y Android.

## Scripts

```bash
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npm start          # Metro
npm run ios        # simulador iOS
npm run android    # emulador Android
npm run lint
npx tsc --noEmit
npm test
```

## Ejecución con la API

La app inicia en **Iniciar sesión** y restaura la sesión con `GET /api/v1/users/me`. Necesita una versión de `kalibra-api` que implemente el contrato v2 (incluye nombres de usuario y `/students/me/courses`). El código local consultado durante esta integración aún no exponía ambos endpoints nuevos; sin esos cambios no se pueden validar los flujos contra el backend real.

1. En el repositorio hermano `kalibra-api`, configura su `.env` local según su documentación (base de datos y proveedores del motor). Para usar cuentas genéricas y HTTP local agrega:

   ```dotenv
   KALIBRA_SEED_GENERIC_USERS=true
   JWT_COOKIE_SECURE=false
   ```

   No versiones ese archivo ni sus credenciales.

2. Levanta el stack desde el repositorio de la API:

   ```bash
   cd ../kalibra-api
   docker compose up --build
   ```

3. Inicia Metro y la app desde este repositorio con `npm start` y `npm run android` o `npm run ios`.

| Plataforma | URL base local |
| --- | --- |
| Emulador Android | `http://10.0.2.2:8080/api/v1` |
| Simulador iOS | `http://localhost:8080/api/v1` |

`src/config/api.ts` selecciona la dirección por `Platform`. Android permite HTTP únicamente a `10.0.2.2` y `localhost` en debug mediante `network_security_config`; release lo bloquea. Estas direcciones son para simuladores, no para dispositivos físicos.

Cuentas genéricas creadas por el seed de la API, exclusivamente para entornos locales:

| Correo | Contraseña |
| --- | --- |
| `estudiante.test1@upc.edu.pe` | `@estudiantetest1` |
| `estudiante.test2@upc.edu.pe` | `@estudiantetest2` |
| `estudiante.test3@upc.edu.pe` | `@estudiantetest3` |

Registro e inicio de sesión envían `application: 'MOBILE_APP'`; las cuentas de docentes/administradores reciben el aviso de acceso denegado. El registro envía el primer término del nombre completo como `firstName` y el resto como `lastName`, y luego inicia sesión para obtener la cookie.

El JWT permanece en la cookie `token` httpOnly del cliente nativo: no se guarda ni se lee desde JavaScript. «Recordar en este dispositivo» no cambia la duración de la cookie; la controla la API. Un 401 en una llamada protegida elimina la sesión y el stack autenticado. Al cerrar sesión se solicita `POST /authentication/sign-out`.

Los recordatorios se persisten con su hora existente; si nunca se configuró una, al habilitarlos se usa `20:00:00` UTC, según el contrato de preferencias. El modo nocturno persiste su preferencia; aún falta implementar una paleta oscura.

Sin ejercicios aprobados, práctica muestra el estado vacío (404); si el motor no está disponible, muestra «Servicio no disponible por el momento» (503). La API no entrega pistas, duración, puntajes de sesión, facultad, ciclo ni tiempo estimado: esos campos se omiten. Las explicaciones se muestran completas tal como las devuelve el servidor, sin sintetizar pasos. El historial lee todas las páginas por curso y conserva los conteos globales al filtrar.

## Arquitectura por capas

```
src/
├── components/ui        primitivos del sistema de diseño (Text, Icon, Button, Chip, ConfirmDialog…)
├── components/layout    AppHeader, BottomTabBar, ScreenContainer, BackLink
├── components/<feature> componentes de cada funcionalidad
├── screens              una pantalla por ruta
├── hooks                estado de cada vista; único puente hacia services
├── services             contratos, cliente HTTP único y mappers puros
├── config               URL local por plataforma
├── test                 fixtures tipados y stub de fetch exclusivo de pruebas
├── navigation           stack raíz, tabs y tipos de rutas
├── theme                tokens (mismo contenido que `@theme` de kalibra-web-app)
├── types                modelos de dominio y variantes de UI
└── utils                funciones puras
```

Los cursos, subtemas y ejercicios son datos: ninguna pantalla depende de un curso concreto.

## Ramas

Toda rama nace de `develop`.

| Rama | Responsable |
| --- | --- |
| `feature/auth-profile` | compañero |
| `feature/courses-enrollment` | Gonzalo |
| `feature/adaptive-practice` | Gonzalo |
| `feature/progress-history` | compañero |

Las funcionalidades estudiantiles están integradas en `feature/api-integration`; esta rama no se publica automáticamente.

## Verificación

```bash
npx tsc --noEmit
npx eslint .
npx jest
```

Los tests reemplazan únicamente el transporte `fetch` por fixtures tipados de cuentas genéricas; los servicios de producción siempre usan HTTP. Incluyen rutas, payloads, cookies, errores, mappers, paginación y navegación completa.

La ilustración `study-preview.png` se extrajo del frame de inicio de sesión proporcionado en `_figma/mobile/02_inicio_sesion.png`.
