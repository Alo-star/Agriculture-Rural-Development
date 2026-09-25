# 🌱 ZeroWasteMart

A browser-based marketplace application for buying, selling, ordering, and managing products with separate OCR and email-service backends.

## ✨ Features

- 🛒 Product browsing and cart management
- 👨‍🌾 Farmer product listing
- 🤝 Broker dashboard
- 📦 Order and checkout flow
- 💳 Order/transaction data handling
- 👤 Login and signup
- 🔐 Password reset flow
- 🧑‍💼 Admin dashboard
- 🔎 OCR image text extraction
- 📊 Product, order, user, and inventory management
- ❤️ Wishlist and notifications
- 📱 Responsive web interface

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Tailwind CSS via CDN (`@tailwindcss/browser@4`)
- Bootstrap 5.3.0 — used in the Admin Dashboard
- Font Awesome 6.0.0

### Browser Data Storage

- `localStorage`
  - Users
  - Products
  - Cart
  - Orders
  - Wishlist
  - Notifications
  - Farmer listings
  - Tracking data

### OCR Backend

- Python
- FastAPI
- Uvicorn
- Pillow
- pytesseract
- Tesseract OCR
- python-multipart
- CORS

### Email Service

- Node.js
- Express.js
- Nodemailer
- CORS

The email service uses Gmail SMTP through Nodemailer for password-reset emails.

## 🏗️ Project Structure

```text
ZeroWasteMart/
│
├── admin/
│   ├── admin.html
│   ├── css/
│   │   └── admin.css
│   └── js/
│       ├── admin.js
│       ├── data.js
│       └── ocr.js
│
├── css/
│   └── auth.css
│
├── images/
│   ├── favicon.svg
│   ├── zerowastemart-icon.svg
│   └── zerowastemart-logo.svg
│
├── js/
│   ├── app.js
│   ├── auth.js
│   └── data.js
│
├── ocr-backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── start_server.py
│   ├── test_ocr.py
│   └── test_frontend.html
│
├── server/
│   ├── email-service.js
│   └── package.json
│
├── server.js/
│   └── server.js
│
├── index.html
├── login.html
├── signup.html
├── farmer-dashboard.html
├── broker-home.html
├── broker-dashboard.html
├── sell-product.html
├── cart.html
├── checkout.html
├── place-order.html
├── donate.html
├── reset-password.html
├── loading.html
└── start.html
```

## 🔎 OCR Service

The OCR backend is a separate FastAPI service.

### Run OCR Backend

```bash
cd ocr-backend
pip install -r requirements.txt
python start_server.py
```

The OCR service runs on:

```text
http://localhost:8000
```

### OCR API

```text
GET  /health
POST /ocr/extract-text
```

The frontend admin OCR module sends uploaded images to:

```text
http://localhost:8000/ocr/extract-text
```

## 📧 Email Service

A separate Node.js/Express service is included for password-reset email delivery.

### Install Dependencies

```bash
cd server
npm install
```

### Start

```bash
npm start
```

The email service runs on:

```text
http://localhost:3001
```

### API

```text
GET  /api/health
POST /api/send-reset-email
```

The service uses **Nodemailer + Gmail SMTP**.

## 💾 Data Storage

The main frontend currently stores application data in the browser using:

```javascript
localStorage
```

No external SQL or NoSQL database is required for the current frontend implementation.

## 🔐 Authentication

The current frontend authentication flow is implemented with JavaScript and browser `localStorage`.

User information and the current login session are stored locally in the browser.

## ⚙️ Run the Frontend

Because the application is primarily HTML/CSS/JavaScript, it can be served using a local static web server.

For example, using VS Code Live Server:

```text
Open the project
→ Run with Live Server
→ Open index.html
```

## 📌 Current Architecture

```text
                ┌──────────────────────────┐
                │      HTML / CSS / JS     │
                │     Main Web Frontend    │
                └────────────┬─────────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
               ▼                           ▼
       ┌────────────────┐          ┌─────────────────┐
       │  localStorage  │          │   OCR Backend   │
       │ Browser Storage│          │ Python FastAPI  │
       └────────────────┘          │ + Tesseract     │
                                   └─────────────────┘

                             +

                      ┌─────────────────┐
                      │  Email Service  │
                      │ Node + Express  │
                      │   + Nodemailer  │
                      └─────────────────┘
```

## 👨‍💻 Project

**ZeroWasteMart**

A web application prototype combining marketplace functionality, farmer selling workflows, admin management, OCR processing, and email-service support.
