# Práctica Backend — NestJS + Docker + Render + MySQL


## Requisitos previos

- **Node.js 20+** — [https://nodejs.org](https://nodejs.org)
- **Docker Desktop** — [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Cuenta GitHub** — para subir tu código
- **Cuenta Render** — [https://render.com](https://render.com) (plan gratuito)
- **Base de datos MySQL** — Aiven ([https://aiven.io](https://aiven.io)) u otra alternativa compatible

---

## Resumen del flujo de la práctica

| Fase | Duración estimada | Actividad |
|---|---|---|
| **Fase 1** | ~40 min | Clonar plantilla, configurar `.env`, corregir Dockerfile, desplegar en Render |
| **Fase 2** | ~20–25 min | Crear módulo `Estudiante`, usar `synchronize: true` temporalmente, insertar datos, proteger endpoints con JWT |

---

## INSTRUCCIONES PARA EL ESTUDIANTE

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd practica-backend
```

### 2. Configurar variables de entorno locales

Copia el archivo de ejemplo y complétalo con tus valores:

```bash
cp .env.example .env
```

**Ejemplo de `.env` (sin espacios alrededor del `=`):**

```env
DB_HOST=mi-servidor.aivencloud.com
DB_PORT=12345
DB_USERNAME=avnadmin
DB_PASSWORD=mi_contraseña_secreta
DB_DATABASE=defaultdb
DB_SYNCHRONIZE=false
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin123!
JWT_SECRET=un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=3600s
```

> ⚠️ **IMPORTANTE:** No dejes espacios antes ni después del signo `=`.  
> Incorrecto: `DB_HOST = localhost`  
> Correcto: `DB_HOST=localhost`

### 3. Levantar la aplicación localmente

```bash
npm install
npm run start:dev
```

La app arranca en `http://localhost:8080` cuando tu archivo `.env` tiene las variables de base de datos configuradas correctamente.

### 4. Usuario administrador (seed automático)

Si defines `ADMIN_USERNAME` y `ADMIN_PASSWORD` en tu `.env`, al **primer arranque con base de datos conectada** se crea automáticamente un usuario administrador con contraseña hasheada (bcrypt) e `isAdmin = true`.

No necesitas insertar el admin manualmente.

**Para cambiar el admin en Render:**

1. Modifica `ADMIN_USERNAME` y/o `ADMIN_PASSWORD` en las variables de entorno de Render.
2. Reinicia el servicio.
3. Si el nuevo username no existe en la BD, se creará al arrancar.

**Para revocar acceso:** elimina el usuario de la tabla `users` en Aiven o cambia su contraseña directamente en la base de datos.

### 5. Obtener token JWT (login)

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

**Respuesta esperada:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6. Usar el token en peticiones protegidas

Copia el valor de `access_token` y úsalo en el header `Authorization`:

```bash
curl -X POST http://localhost:8080/estudiante \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","codigo":"2024001"}'
```

### 7. Flujo completo: login → token → petición

```
┌─────────┐    POST /auth/login     ┌─────────┐
│ Cliente │ ──────────────────────► │   API   │
│         │ ◄────────────────────── │         │
└─────────┘   { access_token }      └─────────┘
     │
     │  Authorization: Bearer <token>
     ▼
┌─────────┐    POST /estudiante     ┌─────────┐
│ Cliente │ ──────────────────────► │   API   │
│         │ ◄────────────────────── │ (JWT +  │
└─────────┘   { id, nombre, codigo }│ Roles)  │
                                    └─────────┘
```

---

## Tarea obligatoria del alumno

Debes completar los siguientes pasos y entregarlos:

### Paso 1 — Crear entidad Estudiante

Crea `src/estudiantes/estudiante.entity.ts` con los campos:

- `id` (PK, autoincremental)
- `nombre` (string)
- `codigo` (string)

Usa como referencia las entidades existentes en `src/users/` y `src/tasks/`.

### Paso 2 — Crear módulo, servicio y controlador

Crea en `src/estudiantes/`:

- `estudiante.module.ts`
- `estudiante.service.ts`
- `estudiante.controller.ts`

Registra `EstudianteModule` en `src/app.module.ts`.

### Paso 3 — POST /estudiante protegido (solo admin)

Implementa `POST /estudiante` y protégelo para que **solo administradores** puedan crear registros.

Revisa cómo está implementado en `src/users/users.controller.ts` (guards, decorador de roles y DTO de entrada) y aplica el mismo patrón.

### Paso 4 — GET /estudiante

Implementa `GET /estudiante` que devuelva el/los registro(s) insertado(s).

### Paso 5 — Crear tablas con synchronize (temporal)

1. En tu archivo `.env` local, activa temporalmente la sincronización de esquema (`DB_SYNCHRONIZE=true`).
2. Si usas **Aiven**, configura SSL en `src/database/database.module.ts` según la documentación de tu proveedor.
3. Ejecuta `npm run start:dev` — TypeORM creará las tablas automáticamente.
4. Verifica en el panel de Aiven que existen las tablas `users`, `estudiante`, etc.

### Paso 6 — Insertar tu registro

Usa `POST /estudiante` con el token de admin.

### Paso 7 — Restaurar synchronize antes del commit final

**Obligatorio:** desactiva la sincronización de esquema en tu `.env` local y en las variables de entorno de Render antes de hacer push.

> Nunca dejes activada la sincronización automática en producción ni en el repositorio final.

### Paso 8 — Crear Dockerfile funcional

1. Copia `Dockerfile.TODO` como `Dockerfile`.
2. Revisa cada bloque marcado con `TODO` y corrige la configuración de build, dependencias, copia de artefactos y comando de arranque.
3. Asegúrate de que la imagen final ejecute la aplicación compilada en modo producción.

### Paso 9 — Verificar .dockerignore

El archivo `.dockerignore` ya está incluido. Asegúrate de que excluye `.env`, `node_modules` y `dist`.

Prueba localmente:

```bash
docker build -t practica-backend .
docker run --env-file .env -p 8080:8080 practica-backend
```

### Paso 10 — Desplegar en Render

1. Sube tu código a GitHub (`git add`, `git commit`, `git push`).
2. En Render: **New → Web Service → Connect your repo**.
3. Selecciona **Language: Docker** (no Node).
4. Agrega las variables de entorno (las mismas del `.env`).
5. **No agregues la variable `PORT`** — Render la inyecta automáticamente.
6. Despliega y espera el build.

---

## Entregables

| # | Entregable |
|---|---|
| 1 | URL del repositorio GitHub con historial de commits |
| 2 | URL pública de Render donde `GET /estudiante` responda correctamente |
| 3 | Pantalla de Aiven mostrando la tabla `estudiante` creada |
| 4 | Respuestas al quiz |

---

## Checklist antes de entregar

- [ ] `DB_SYNCHRONIZE=false` en `.env` y en Render
- [ ] `.env` NO está en el repositorio (solo `.env.example`)
- [ ] `Dockerfile` funcional (sin `.TODO`)
- [ ] `POST /estudiante` requiere JWT + rol admin
- [ ] `GET /estudiante` devuelve datos
- [ ] Variables de entorno configuradas en Render
- [ ] App accesible por URL pública

---


## Comandos útiles

```bash
# Desarrollo
npm install
npm run start:dev
npm run build

# Docker
docker build -t practica-backend .
docker run --env-file .env -p 8080:8080 practica-backend
docker ps
docker logs <container_id>


curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

curl http://localhost:8080/estudiante

curl -X POST http://localhost:8080/estudiante \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","codigo":"2024001"}'
```

---

## Estructura del proyecto

```
practica-backend/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
├── .dockerignore
├── .env.example
├── Dockerfile.TODO          ← corregir y renombrar a Dockerfile
├── seed/
│   └── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    │   ├── common.module.ts
    │   ├── decorators/
    │   │   └── roles.decorator.ts
    │   ├── enums/
    │   │   └── role.enum.ts
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts
    │   │   └── roles.guard.ts
    │   └── interfaces/
    │       └── jwt-payload.interface.ts
    ├── database/
    │   ├── database.module.ts
    │   └── database-init.service.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── auth.controller.ts
    │   └── dto/
    │       └── login.dto.ts
    │   └── strategies/
    │       └── jwt.strategy.ts
    ├── users/
    │   ├── user.entity.ts
    │   ├── users.module.ts
    │   └── users.service.ts
    ├── tasks/
    │   ├── task.entity.ts
    │   ├── task.module.ts
    │   ├── task.service.ts
    │   └── task.controller.ts
    └── estudiantes/         ← TU TAREA: crear los archivos aquí
        └── (vacío)
```

---

## Seguridad y buenas prácticas

- Las contraseñas se almacenan hasheadas con **bcryptjs** — nunca en texto plano.
- `JWT_SECRET` debe ser un valor largo y aleatorio, definido solo en variables de entorno.
- **Nunca** subas `.env` al repositorio.
- Usa `DB_SYNCHRONIZE=true` **solo temporalmente** en desarrollo local.
- En producción, usa migraciones de TypeORM (fuera del alcance de esta práctica).

---
