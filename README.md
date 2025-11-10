# smartParking

A full-stack web app that helps users find nearby available parking spots using OpenStreetMap APIs.

---

## 🔧 Backend Setup

### 1. Create `.env` in the root folder:

```
# Server Configuration
PORT=your_desired_port

# mysql Database Configuration
PGUSER=username
PGPASSWORD=password
PGHOST=host_url
PGDATABASE=database_name

# Arcjet Configuration
ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development

# Session Secret for express-session
SESSION_SECRET=your_session_secret
ORS_API_KEY=your_openrouteservice_api_key

# Razorpay credentials
KEY_ID="your_key_id"
KEY_SECRET="your_key_secret"

# Admin signup
ADMIN_SECRET="your_admin_secret"
```

### 2. Start Backend Server:

```bash
npm install
npm run dev
```

---

## 💻 Frontend Setup

```bash
cd ./frontend
```

### 1. Create `.env` in the `frontend` folder:

```
VITE_BASE_URL="http://localhost:3000/api"
```

### 2. Start Frontend Server:

```bash
npm install
npm run dev
```

---

## 🔑 API Keys Setup

### 📍 OpenRouteService
- Website: https://openrouteservice.org  
- Sign Up: https://openrouteservice.org/dev/#/signup  
- API Docs: https://openrouteservice.org/dev/#/api-docs

### 🛡️ Arcjet
- Docs: https://docs.arcjet.com/get-started/#:~:text=Set%20your%20key,-Section%20titled%20%E2%80%9C2&text=Create%20a%20free%20Arcjet%20account,file%20in%20your%20project%20root.

### 💰 Razorpay
- Docs: https://razorpay.com/docs/payments/dashboard/account-settings/api-keys//?preferred-country=IN

### 🛠️ Admin Dashboard

- The admin dashboard can be accessed directly via:

  ```
  http://localhost:5173/admin
  ```

- There is **no navigation button** to access it — it must be visited manually.
- To sign up as admin, use the `ADMIN_SECRET` in your `.env` file.