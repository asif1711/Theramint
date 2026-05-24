# Theramint — Empathetic Mental Healthcare Ecosystem

Theramint is a modern full-stack digital mental wellness and tele-therapy platform designed to bridge the gap between licensed mental health practitioners and individuals seeking compassionate, structured support. The ecosystem integrates secure user authorization, interactive clinical booking, practitioners' session logging, and comprehensive administrative oversight with automated CSV audit generation.

---

## 🌟 Key Capabilities

### 1. Client Onboarding & Session Booking
- **Personalized Search & Filters**: Clients can browse fully detailed therapist profiles based on expertise, professional credentials, years of experience, and availability.
- **Interactive Chronos Calendar**: Interactive real-time slot selection with precise timing.
- **Client Workspace**: Comprehensive panel to monitor upcoming appointments, billing statuses (`UNPAID`, `PAID`, `REFUNDED`), and request secure administrative assistance through support tickets.

### 2. Clinical Therapist Workspace
- **Appointment Queue**: Real-time structured list sorting upcoming sessions chronologically. Clear separation of Session Types (Online vs. In-person) and real-time Payment Verification statuses.
- **Treatment Log Engine**: Allows practitioners to log clinical notes, define appointment outcomes, build private therapeutic summaries, and schedule automatic follow-up dates.
- **Clinical Analytics**: Real-time performance counters highlighting total patient counts, scheduled, and completed hours.

### 3. Administrative Master Panel
- **System-Wide Dashboard**: High-level platform telemetry containing total active clients, practitioners, session outcomes, and overall financial metrics.
- **Account Moderation & Registry**: Secure controls to search, filter, edit, toggle account status (`ACTIVE`, `SUSPENDED`), and manually provision new licensed therapists with detailed bios and qualifications.
- **Administrative Master Report Compilation**: Generate instant, deep database audits that export all active Users, Practitioner registries, Consultation calendars, and open Support tickets into a standard structured CSV document for local review.

---

## 🛠️ Technological Architecture

Theramint is built as a unified, high-performance web application designed for high security and seamless client interactions:

- **Frontend Core**: **React 19** styled with low-contrast, calming **Tailwind CSS** guidelines. Supports fluid layouts, accessible font pairings (Inter and display typography), and responsive micro-interactions powered by **motion** layout animations.
- **Design Foundations**:
  - Typography: Pairs polished sans-serif Inter layouts with clean editorial spacing.
  - Color Palette: Soft off-whites, calming mint greens (`mint-50` to `mint-800`), and charcoal grays.
  - Interactive Icons: Rendered with **Lucide React**.
- **Backend API Server**: **Express 4.21** writing in Node.js server environment. Configured with a modular router mapping REST endpoints.
- **Database Logic**: Powered by **Prisma client** with an optimized, secure relational database schema.
- **Security & Authorization**:
  - Secure passwords using **bcryptjs** hashing.
  - Stateful user session parsing.
  - Secure two-factor authentication (2FA) verification code logic.
  - Strict middleware guards validating role privileges (`CLIENT`, `THERAPIST`, `ADMIN`).

---

## 📂 Structural Database Schema

Our database maps relationship constraints to ensure absolute data consistency under high-concurrency booking actions:

### `User`
- Represents the principal security entity.
- Fields: `id`, `fullName`, `email`, `passwordHash`, `role` (`CLIENT`, `THERAPIST`, `ADMIN`), `status` (`ACTIVE`, `SUSPENDED`), `emailVerified`, `twoFactorCode`, `twoFactorExpiry`, `createdAt`.
- Relations: One-to-one with `Therapist` profile, one-to-many with `Appointment` schedules, and one-to-many with platform support requests.

### `Therapist`
- Connects back to `User` table to provide clinical profiles.
- Fields: `id`, `userId`, `specialization`, `experienceYears`, `availabilityStatus`, `qualifications`, `professionalBio`, `consultationMode` (`Online`, `InPerson`), `contactDetails`.
- Relations: Managed one-to-many connection with assigned appointments.

### `Appointment`
- Orchestrates patient-practitioner engagements.
- Fields: `id`, `userId` (Client ID), `therapistId`, `appointmentDate`, `appointmentTime`, `status` (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), `paymentStatus` (`UNPAID`, `PAID`, `REFUNDED`), `amount`, `sessionType` (`ONLINE`, `IN_PERSON`), `notes`.
- Relations: Has one optional associated `SessionRecord`.

### `SessionRecord`
- Holds diagnostic and administrative summaries compiled by therapists.
- Fields: `id`, `appointmentId`, `summary`, `therapistNotes` (clinical data), `followUpDate`, `remarks`.

### `SupportRequest`
- Platform health ticketing database.
- Fields: `id`, `userId`, `subject`, `message`, `priority` (`Low`, `Medium`, `High`), `status` (`OPEN`, `RESOLVED`, `CLOSED`), `createdAt`.

---

## 🚦 REST Backend Endpoints Matrix

### Authorization (`/api/auth/*`)
- `POST /api/auth/register` — Instantiates a fresh client or therapist credential.
- `POST /api/auth/verify-email` — Confirms signup verification token.
- `POST /api/auth/resend-verification` — Restrikes the email sign-up email request.
- `POST /api/auth/login` — Negotiates password and handles 2FA challenge initiation.
- `POST /api/auth/verify-2fa` — Completes MFA challenges confirming token match.
- `POST /api/auth/logout` — Destroys current HTTP-only cookie sessions.
- `GET /api/auth/me` — Fetches current payload profile.

### Platform Services (`/api/*`)
- `GET /api/therapists` — Returns active mental health experts with advanced sorting.
- `GET /api/therapists/:id/availability` — Evaluates real-time appointment coordinates.
- `POST /api/appointments` — Schedules a prospective therapeutic session.
- `GET /api/appointments/my` — Retreives personalized schedules.
- `PATCH /api/appointments/:id/status` — Prompts state change (e.g., cancellation or completion).
- `PATCH /api/appointments/:id/payment` — Verifies billing status.

### Specialist & Diagnostic Tools (`/api/therapist/*`)
- `GET /api/therapist/analytics` — Generates clinical practice statistics.
- `POST /api/session-records` — Publishes permanent electronic health logs.

### Master Admin Engine (`/api/admin/*`)
- `GET /api/admin/analytics` — Extracts globally coupled platform metrics.
- `GET /api/admin/users` — Queries complete system identity register.
- `POST /api/admin/users` — Dispatches manual account generation (e.g. provisioning high-risk practitioner accounts).
- `PATCH /api/admin/users/:id` — Overwrites account details.
- `DELETE /api/admin/users/:id` — Permanently revokes login rights.
- `PATCH /api/admin/users/:id/status` — Toggles state flags (`ACTIVE` or `SUSPENDED`).
- `GET /api/admin/report/csv` — Dynamically compiles complete platform database audits directly into structured CSV download.

---

## 💻 Getting Started & Launching

Follow these directions to boot the environment:

### Prerequisite Environment Keys
Configure `.env` with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/theramint"
GEMINI_API_KEY=""
```

### Installation & Run
1. **Initialize Core Modules**:
   ```bash
   npm install
   ```
2. **Apply Database Migrations**:
   ```bash
   npx prisma db push
   ```
3. **Execute Active Dev Workspace**:
   ```bash
   npm run dev
   ```
4. **Compile Production Artifacts**:
   ```bash
   npm run build
   ```
