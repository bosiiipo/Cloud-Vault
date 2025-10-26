# Cloud‑Vault
A secure, cloud‑native file vault API built with TypeScript, Docker, and PostgreSQL.

## ✅ Features
- RESTful API for uploading, downloading, and managing files
- Uses PostgreSQL for metadata storage
- Compatible with S3‑style object storage (e.g., Cloudflare R2)
- Strict TypeScript, ESLint, and Prettier setups for code quality
- Automated tests included (via Jest)
- Ready for production: environment‑aware, scalable design

## 🧱 Architecture
1. **Express** server in TypeScript handles HTTP API.
2. File metadata (owner, key, size, upload time, etc.) is stored in PostgreSQL.
3. File contents are stored in an S3‑compatible bucket/service.
4. API endpoints implement secure access (authentication/authorization added).

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Docker & Docker‑Compose
- PostgreSQL instance
- S3‑compatible object storage (e.g., Cloudflare R2)
- Environment variables (see `.env.example`)

### Installation
```bash
git clone https://github.com/bosiiipo/Cloud‑Vault.git
cd Cloud‑Vault
npm install
```

### Configuration
Create a `.env` file (or use environment variables) with the following keys:
```
DATABASE_URL=postgres://user:password@localhost:5432/cloudvault
S3_ENDPOINT=https://<your‑r2‑endpoint>
S3_BUCKET=<bucket‑name>
S3_ACCESS_KEY=<access‑key>
S3_SECRET_KEY=<secret‑key>
PORT=8080
```

### Running Locally
```bash
npm run dev   
```

### Database Migrations
If migrations are configured (e.g., via TypeORM or Prisma), run:
```bash
npm run prisma:migrate
npm run prisma:generate
```

## 🔐 Security Considerations
- Implement authentication (JWT, OAuth2, etc.)
- Ensure permissions: users only access their own files
- Use HTTPS in production
- Set appropriate CORS headers
- For large files, support streaming & range requests

## ✅ Tests
```bash
npm test
```
Tests cover major endpoints & services.
