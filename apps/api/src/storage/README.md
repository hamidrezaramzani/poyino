# Storage Module

Reusable, provider-independent object storage for Poyino.

Business modules call `StorageService` only. They never import the AWS SDK or
talk to S3 / MinIO / R2 / Spaces directly.

## Architecture

```
storage/
  storage.module.ts       # Nest module (global)
  storage.service.ts      # Public facade used by business modules
  config/                 # Env validation / config loading
  constants/              # Tokens, folders, rejected MIME types
  dto/                    # Shared types
  exceptions/             # Typed storage errors
  interfaces/             # StorageProvider contract
  logging/                # Pino logger (no credentials / secrets)
  providers/
    s3.provider.ts        # S3-compatible client (ParsPack, AWS, MinIO, R2, …)
  README.md
```

```
Business Module
      ↓
StorageService          (metadata + validation + logging)
      ↓
StorageProvider         (interface)
      ↓
S3StorageProvider       (AWS SDK)
      ↓
S3-compatible storage
```

Swap providers by changing the `STORAGE_PROVIDER` binding in `storage.module.ts`.

## Upload flow

1. Business module validates domain rules (e.g. PDF-only resumes).
2. Business module calls `StorageService.upload(...)`.
3. StorageService generates a UUID object key under a folder prefix.
4. Provider uploads bytes to the configured bucket.
5. StorageService persists object metadata in `stored_files`.
6. Caller receives a file id — never a local path.

Object key layout:

```
resumes/{scope}/{uuid}.pdf
organizations/{organizationId}/{uuid}.png
avatars/{scope}/{uuid}.jpg
attachments/{scope}/{uuid}.bin
```

Resume uploads start under `resumes/{organizationId}/…`. After an application is
created, Public Job moves the object to `resumes/{applicationId}/{uuid}.pdf`.

Original filenames are stored only in metadata (`originalName`).

## Configuration

Required environment variables (via NestJS `ConfigModule` / `ConfigService`):

```bash
STORAGE_PROVIDER=s3
S3_ENDPOINT=https://c819915.parspack.net
S3_REGION=us-east-1
S3_BUCKET=c819915
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_PUBLIC_URL=https://c819915.parspack.net
```

Optional:

```bash
S3_FORCE_PATH_STYLE=true
S3_SIGNED_URL_TTL_SECONDS=3600
STORAGE_LOG_LEVEL=info
```

Startup fails fast if required S3 variables are missing.

Works with any S3-compatible endpoint (AWS S3, Cloudflare R2, MinIO, Liara,
DigitalOcean Spaces, ParsPack, …) by changing endpoint / credentials / bucket.

## Usage examples

```ts
import { StorageService } from "../storage";

// Upload
const file = await this.storageService.upload({
  organizationId,
  folder: "resumes",
  scope: organizationId,
  buffer,
  originalName: "cv.pdf",
  mimeType: "application/pdf",
  maxBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ["application/pdf"],
});

// Download by id
const { content, mimeType, fileName } =
  await this.storageService.download(file.id);

// Signed URL
const url = await this.storageService.generateSignedUrl(file.id, 900);

// Delete object + metadata
await this.storageService.delete(file.id);
```

## Security

- Rejects known executable MIME types.
- Enforces optional `allowedMimeTypes` and `maxBytes` on upload.
- Never logs access keys, secret keys, or file bodies.

## Database metadata

`stored_files` stores provider-agnostic object metadata:

| Field | Purpose |
|-------|---------|
| provider | e.g. `s3` |
| bucket | Bucket name |
| objectKey | Object key in the bucket |
| originalName | Caller-supplied filename |
| mimeType | Content type |
| extension | Derived extension (`pdf`, `png`, …) |
| sizeBytes | Byte length |
| etag | Provider etag when available |
| publicUrl | Optional public URL |

No local filesystem paths are stored.
