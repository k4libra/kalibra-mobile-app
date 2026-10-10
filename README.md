# Kalibra Mobile App

App del estudiante de Kalibra (React Native): cursos e invitaciones, práctica adaptativa, progreso, historial y perfil.

> Estado actual: **solo interfaz y navegación**. No hay integración con la API; los datos salen de servicios simulados (`src/mocks`).

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

## Acceso de demostración

La app inicia en **Iniciar sesión**. Credenciales exclusivamente locales del mock:

| Campo | Valor |
| --- | --- |
| Correo | `v.morales@upc.edu.pe` |
| Contraseña | `Kalibra2025!` |

El demo conserva sus cursos y estadísticas (77 ejercicios, 71% de dominio, 3 cursos activos). Un registro válido con otro correo institucional (`.edu` o `.edu.pe`) entra a Cursos sin inscripciones y con estadísticas en cero. La contraseña requiere al menos ocho caracteres, letras y números.

Las cuentas y preferencias se mantienen **solo en memoria** y se reinician al cerrar el runtime. «Recordar en este dispositivo» no persiste credenciales. Al cerrar sesión se elimina el stack autenticado; Android back no puede recuperar los tabs.

Para ver los estados vacíos (sin cursos) cambia `MOCK_SCENARIO` a `'empty'` en `src/mocks/scenario.ts`.

## Arquitectura por capas

```
src/
├── components/ui        primitivos del sistema de diseño (Text, Icon, Button, Chip, ConfirmDialog…)
├── components/layout    AppHeader, BottomTabBar, ScreenContainer, BackLink
├── components/<feature> componentes de cada funcionalidad
├── screens              una pantalla por ruta
├── hooks                estado de cada vista; único puente hacia services
├── services             contratos y servicios (hoy apuntan a mocks)
├── mocks                datos de ejemplo y servicios simulados
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

Las pantallas de otras ramas muestran `PlaceholderScreen` hasta que se integran.

## Reglas por capa

[Componentes](src/components/README.md) · [Pantallas](src/screens/README.md) · [Hooks](src/hooks/README.md) · [Servicios](src/services/README.md) · [Contexto](src/context/README.md) · [Tipos](src/types/README.md) · [Utilidades](src/utils/README.md) · [Mocks](src/mocks/README.md) · [Navegación](src/navigation/README.md).

La ilustración `study-preview.png` se extrajo del frame de inicio de sesión proporcionado en `_figma/mobile/02_inicio_sesion.png`.
