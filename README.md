# Kwehu Delivery — Backend

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Then edit .env with your real keys
```

### 3. Set up Supabase
- Create a free project at https://supabase.com
- Go to SQL Editor and paste the contents of `supabase/schema.sql`
- Copy your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into `.env`

### 4. Set up Mpesa (Safaricom Daraja)
- Register at https://developer.safaricom.co.ke
- Create an app to get Consumer Key & Secret
- Use sandbox credentials for testing
- Set `MPESA_CALLBACK_URL` to your public URL (use ngrok for local testing)

### 5. Set up Africa's Talking (SMS / OTP)
- Register at https://africastalking.com
- Get your API key (use sandbox for testing, username = `sandbox`)

### 6. Run the server
```bash
npm run dev   # development (auto-restart)
npm start     # production
```

### 7. Open the frontend
Open `kwehu-delivery.html` in your browser.
Change the `API` constant at the top of the script to your backend URL.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/send-otp | Send OTP to phone |
| POST | /api/auth/verify-otp | Verify OTP and get JWT |
| GET  | /api/auth/me | Get current user |
| GET  | /api/vendors | List all approved vendors |
| GET  | /api/vendors/:id | Get vendor + products |
| POST | /api/vendors | Register new vendor |
| GET  | /api/products | List products |
| POST | /api/products | Add product (vendor) |
| GET  | /api/orders | Get orders (role-filtered) |
| POST | /api/orders | Place new order |
| PATCH| /api/orders/:id/status | Update order status |
| POST | /api/payments/mpesa/stk-push | Trigger Mpesa payment |
| POST | /api/payments/mpesa/callback | Safaricom callback |
| GET  | /api/admin/dashboard | Admin metrics |
| PATCH| /api/admin/vendors/:id/approve | Approve/reject vendor |
| PATCH| /api/admin/riders/:id/approve | Approve/reject rider |

## Deployment (Render.com — free tier)
1. Push code to GitHub
2. Create a Web Service on https://render.com
3. Set environment variables in the Render dashboard
4. Deploy — Render auto-detects Node.js

## Tech Stack
- **Node.js + Express** — API server
- **Supabase (PostgreSQL)** — Database + Auth + Realtime
- **Mpesa Daraja API** — STK push payments
- **Africa's Talking** — SMS OTP
