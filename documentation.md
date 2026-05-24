# Theramint Platform Documentation

Welcome to the Theramint Platform technical and operational guide. This comprehensive index outlines the architectural pathways, systemic database structures, role privilege models, and developer specifications governing our empathetic digital care delivery model.

---

## 📌 1. Architecture Overview

Theramint utilizes a modern, cohesive full-stack architecture that keeps secrets secure by running all critical integration layers (authentication, database queries, and third-party APIs) inside a robust server-side Express environment.

```
+------------------------------------------------------------+
|                       CLIENT BROWSER                       |
|  - React 19 SPA running in Vite                           |
|  - High-Contrast Tailwind CSS                              |
|  - Motion layout micro-animations                         |
+-----------------------------+------------------------------+
                              |
                     HTTPS REST Requests
                              |
+-----------------------------v------------------------------+
|                     EXPRESS API SERVER                      |
|  - REST endpoints grouped in /api Router                   |
|  - Strict JWT-based stateful authentication               |
|  - Server-side validation & encryption guards              |
+-----------------------------+------------------------------+
                              |
                        Prisma Queries
                              |
+-----------------------------v------------------------------+
|                  POSTGRESQL / SQLITE DB                    |
|  - Relational mapping of client profiles                   |
|  - Practitioner records & appointment schedules            |
|  - Clinical logs & ticketing support records               |
+------------------------------------------------------------+
```

### Key Security Standards
1. **API Keys Integration**: No API keys or secret environment variables are exposed to the client-side browser bundle. All requests are routed through safe server proxies.
2. **Session Guard**: Authentication is handled via stateful auth. Restrictive access-token checking ensures high user safety.
3. **Clinical File Encryption**: Private diagnostic notes and records authored under `SessionRecord` require active practitioner credential headers and cannot be accessed by external clients or unprivileged roles.

---

## 🗄️ 2. Database & Schema Specifications

The relational structure of Theramint is compiled using Prisma.

### Database Models Diagram
- **User (Role: CLIENT / THERAPIST / ADMIN)**
  - `id` (Primary Key, String / CUID)
  - `fullName`, `email`, `passwordHash` (Argon2 / BCrypt hash)
  - `role`, `status` (`ACTIVE`, `SUSPENDED`), `emailVerified`
  - *Relations*:
    - One-To-One: `Therapist` (if therapist role)
    - One-To-Many: `appointments`, `supportRequests`, `adminLogs`
- **Therapist**
  - `id`, `userId` (Foreign Key -> User)
  - `specialization`, `experienceYears`, `availabilityStatus`, `professionalBio`, `qualifications`, `consultationMode`
  - *Relations*:
    - One-To-Many: `appointments`
- **Appointment**
  - `id`, `userId` (Owner clientId), `therapistId` (Licensed providerId)
  - `appointmentDate`, `appointmentTime`, `status` (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), `paymentStatus` (`UNPAID`, `PAID`, `REFUNDED`), `amount`, `sessionType` (`ONLINE`, `IN_PERSON`), `notes`
  - *Relations*:
    - One-To-One: `sessionRecord` (Only configured when session has clinical entries)
- **SessionRecord**
  - `id`, `appointmentId` (Foreign Key -> Appointment)
  - `summary` (Client visible recap), `therapistNotes` (Internal clinical documentation), `followUpDate`, `remarks`
- **SupportRequest**
  - `id`, `userId`, `subject`, `message`, `priority`, `status`
- **AdminLog**
  - `id`, `adminId`, `actionType`, `actionDescription`, `createdAt`

---

## 🚦 3. API Payload Specifications

### 3.1 Sign Up / Authentication
#### `POST /api/auth/register`
- **Payload**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "CLIENT"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully. Please verify your email.",
    "userId": "cuid_xxxxxxxxx"
  }
  ```

#### `POST /api/auth/login`
- **Payload**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** (200 OK — initiates 2FA challenge):
  ```json
  {
    "status": "requires_2fa",
    "message": "Two-factor authentication code sent to your registered email."
  }
  ```

#### `POST /api/auth/verify-2fa`
- **Payload**:
  ```json
  {
    "email": "jane@example.com",
    "code": "123456"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "message": "Successfully logged in.",
    "user": {
      "id": "cuid_xxxx",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "CLIENT"
    }
  }
  ```

---

### 3.2 Practitioner Discovery & Booking
#### `GET /api/therapists`
- **Query Parameters**: `specialization` (string), `availability` (string).
- **Response**: List of active registered therapists with user details nested.

#### `POST /api/appointments`
- **Payload**:
  ```json
  {
    "therapistId": "therapist_cuid",
    "date": "2026-05-29",
    "time": "10:00 AM",
    "sessionType": "ONLINE",
    "notes": "Anxious about upcoming project launch."
  }
  ```
- **Response** (201 Created): Generates appointment slot nested in SQLite/PostgreSQL with `PENDING` initial status.

---

### 3.3 Clinical Diagnostics (Therapist Only)
#### `POST /api/session-records`
- **Role Constraint**: `THERAPIST`
- **Payload**:
  ```json
  {
    "appointmentId": "appointment_cuid",
    "summary": "Patient showed active listening and processed anxieties regarding work.",
    "therapistNotes": "Patient exhibiting clinical-grade anxiety spikes. Focus on CBT exercises.",
    "followUpDate": "2026-06-12",
    "remarks": "Scheduled follow-up."
  }
  ```
- **Response** (201 Created): Commit clinical diagnostic record.

---

### 3.4 Governance & Audit (Admin Only)
#### `GET /api/admin/report/csv`
- **Role Constraint**: `ADMIN`
- **Action**: Iterates over all platform entities (`User`, `TherapistProfile`, `AppointmentQueue`, `SupportRequests`) in parallel and formats database entries with a custom CSV encoder. Strips and escapes double quotes (`"`) and commas to prevent injection attacks and corruption of structural grids.
- **Output**: Attaches system-level attachments directly to response, prompting standard browser CSV download:
  `theramint_admin_report_YYYYMMDD_HHMMSS.csv`

---

## 🎨 4. Design & Component Guidelines

When modifying views or extending visual modules, designers must adhere to the **Theramint Human-Centered Design System**:

1. **Brand Foundations**:
   - `bg-sage-50`: Custom cooling cream canvas backdrop.
   - `text-zinc-900`: Charcoal elements delivering clean high-contrast readability against creams and mints.
   - `text-mint-600`: Accented branding highlights.
2. **Layout Boundaries**:
   - For simple structural request components, default to a **Single-View Constraint**, preserving high legibility using fluid constraints (`w-full max-w-7xl mx-auto`).
   - Cards must carry smooth border edges (`rounded-[2rem]` or `rounded-[2.5rem]`) and elegant, high-contrast borders (`border border-zinc-100`) rather than drop shadows that clutter layouts.
3. **Icons & Elements**:
   - Import exclusivement via `'lucide-react'`.
   - Never generate arbitrary inline SVG structures; instead utilize the custom library.

---

## 📈 5. Operational System Audit & Deployment

### Run Scripts
- `npm run dev`: Boot up the Express developer node coupled with Vite asset pipeline.
- `npm run lint`: Triggers the type system checker verifying typescript configurations (`tsc --noEmit`).
- `npm run build`: Packages static client components in `dist/` and compiles backend server scripts cleanly into optimized `dist/server.cjs` bundling.
- `npm run start`: Boots highly performant compiled backend server node.
