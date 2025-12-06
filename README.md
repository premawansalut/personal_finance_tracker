# Budget Mate – Personal Finance Tracker

Budget Mate is a personal finance management app built with **Flutter** (mobile frontend) and **Node.js + Express** (REST API backend) using a **PostgreSQL** database.  
It helps users track incomes and expenses, organise them by category, and view monthly statistics.

---

## 1. Features

### Frontend (Flutter)
- User authentication (login / registration)
- Add, edit, delete:
  - Incomes
  - Expenses
  - Categories
- Monthly income/expense overview
- Category-wise summary
- Statistics view (e.g. bar/pie charts using API data)
- Persistent login with `SharedPreferences`
- Light, responsive UI optimised for Android devices

### Backend (Node.js + Express)
- RESTful API for:
  - User authentication
  - Incomes CRUD
  - Expenses CRUD
  - Categories CRUD
  - Monthly statistics
- PostgreSQL integration with parameterised queries
- Validation and error handling
- Environment-based configuration (dev / prod)
- Ready for deployment on platforms like **Cloud Run**

---

## 2. Tech Stack

### Frontend
- **Framework:** Flutter (Dart)
- **Packages (examples):**
  - `http` – API calls
  - `shared_preferences` – local storage for tokens / settings
  - (Optional) `provider` / `riverpod` – state management
  - (Optional) `fl_chart` / similar – charts for statistics

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Core NPM packages (typical):**
  - `express`
  - `pg` / `pg-pool`
  - `dotenv`
  - `cors`
  - `jsonwebtoken` (if using JWT auth)
  - `bcrypt` / `bcryptjs` (if hashing passwords)
  - `joi` / `express-validator` (for validation)

---

## 3. Project Structure (example)

Adjust according to your actual repo:

```text
budget-mate/
├─ budget-mate-frontend/        # Flutter app
│  ├─ lib/
│  │  ├─ main.dart
│  │  ├─ api/
│  │  │  └─ api_service.dart
│  │  ├─ models/
│  │  ├─ screens/
│  │  └─ widgets/
│  └─ pubspec.yaml
│
└─ budget-mate-backend/         # Node.js API
   ├─ src/
   │  ├─ server.js
   │  ├─ routes/
   │  ├─ controllers/
   │  ├─ models/
   │  └─ db/
   ├─ package.json
   └─ .env.example
```

---

## 4. Getting Started

### 4.1 Prerequisites

- **General**
  - Git
- **Backend**
  - Node.js (LTS version)
  - PostgreSQL server
- **Frontend**
  - Flutter SDK (latest stable)
  - Android Studio / VS Code with Flutter & Dart plugins
  - Android emulator or physical Android device

---

## 5. Backend Setup (Node.js + PostgreSQL)

1. Navigate to the backend folder:

   ```bash
   cd budget-mate-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create PostgreSQL database (example):

   ```sql
   CREATE DATABASE budget_mate;
   ```

4. Configure environment variables:

   Create `.env` from `.env.example` (if exists) or manually:

   ```bash
   # .env
   PORT=3700
   DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/budget_mate
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

5. Run migrations / create tables  
   (if you use a migration tool, run its command; otherwise make tables manually).

6. Start the server:

   ```bash
   npm start
   # or
   npm run dev
   ```

   The API should be available at:

   ```text
   http://localhost:3700/api
   ```

---

## 6. Frontend Setup (Flutter)

1. Navigate to the Flutter project:

   ```bash
   cd budget-mate-frontend
   ```

2. Install Flutter dependencies:

   ```bash
   flutter pub get
   ```

3. Configure API base URL in `api_service.dart` (or similar):

   ```dart
   class ApiService {
     static const bool USE_LOCAL_BACKEND = true;

     static String get BASE_URL {
       if (USE_LOCAL_BACKEND) {
         // Emulator:
         // return 'http://10.0.2.2:3700/api';

         // Physical Android device (same Wi-Fi as your machine):
         // Replace with your machine's local IP
         return 'http://192.168.xx.xx:3700/api';
       } else {
         // Production (Cloud Run, etc.)
         return 'https://your-cloud-run-url.europe-north1.run.app/api';
       }
     }
   }
   ```

4. Run the app:

   ```bash
   flutter run
   ```

   Select emulator or connected device.

---

## 7. API Overview

Base URL (dev):

```text
http://localhost:3700/api
```

### 7.1 Authentication

- `POST /auth/register`  
  Register a new user.

- `POST /auth/login`  
  Login, return access token (and refresh token if implemented).

### 7.2 Incomes

- `GET /incomes` – list incomes for logged-in user  
- `POST /incomes` – create new income  
- `PUT /incomes/:id` – update income  
- `DELETE /incomes/:id` – delete income  

Example request body:

```json
{
  "date": "2025-11-30",
  "amount": 1500,
  "source": "Salary",
  "note": "November salary"
}
```

### 7.3 Expenses

- `GET /expenses`
- `POST /expenses`
- `PUT /expenses/:id`
- `DELETE /expenses/:id`

Example body:

```json
{
  "date": "2025-11-30",
  "amount": 25.5,
  "category": "Food",
  "note": "Lunch"
}
```

### 7.4 Categories

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### 7.5 Expense Statistics

- `GET /expenses/statistics?year=YYYY&month=MM`

Example response:

```json
{
  "label": "2025 Nov Expense Statistics",
  "year": 2025,
  "month": 11,
  "total_expense": 300,
  "category_summary": [
    {
      "category": "Food",
      "total": "200.00"
    },
    {
      "category": "Transport",
      "total": "100.00"
    }
  ]
}
```

The Flutter statistics screen can consume this endpoint to render bar or pie charts.

---

## 8. Running in Production

- Deploy backend (e.g. Google Cloud Run) with environment variables set.
- Update Flutter `BASE_URL` to the production API URL, for example:

  ```dart
  return 'https://budget-mate-backend-xxxxxxxxxx.europe-north1.run.app/api';
  ```

- Build a release APK / App Bundle:

  ```bash
  flutter build apk --release
  # or
  flutter build appbundle --release
  ```

Install the APK on your device for testing.

---

## 9. Troubleshooting

- **SocketException / Failed host lookup**  
  - Check `BASE_URL` is reachable from device.
  - For local dev on physical device, make sure:
    - Device and computer are on the same network.
    - You are using your computer’s LAN IP instead of `localhost`.
- **CORS issues (web builds)**  
  - Configure CORS in the backend (`cors` middleware).
- **Database connection errors**  
  - Verify `DATABASE_URL` in `.env`.
  - Check PostgreSQL is running and the database exists.

---

## 10. License

Add your preferred license here (e.g. MIT, Apache-2.0).
