# 🌌 Dusk Protocol — Web Prototype

An experimental web prototype demonstrating **gesture-driven image transfer**, inspired by Huawei’s Air Gesture system. This project showcases real-time interaction between devices using webcam-based hand gesture recognition.

---

## ✨ Overview

The **Dusk Protocol Web Prototype** enables users to transfer images using intuitive hand gestures like **GRAB** and **DROP**, simulating a seamless cross-device interaction experience.

Built as a modular system inside the `dusk-protocol` repository.

---

## 🚀 Features

- 🎯 **Gesture-Based Transfer**
  - Use **GRAB** to pick an image
  - Use **DROP** to send it to another user

- 📷 **Real-Time Detection**
  - Webcam-powered gesture recognition via Teachable Machine + ml5.js

- 🔗 **Two-User Simulation**
  - Sender (`id1`) and Receiver (`id2`) interaction flow

- 🎨 **Modern UI**
  - Responsive and animated interface with real-time feedback

---

## 🏗️ Project Structure

```
dusk-protocol/
│
├── web-prototype/
│   ├── client/     # React + Vite frontend
│   └── server/     # Express backend
│
└── README.md
```

---

## ⚙️ Getting Started

### 📋 Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Galib-23/dusk-protocol.git
cd dusk-protocol
```

---

### 2️⃣ Install Dependencies

#### Client
```bash
cd web-prototype/client
npm install
```

#### Server
```bash
cd ../server
npm install
```

---

### 3️⃣ Run the Application

#### Start Backend
```bash
cd web-prototype/server
npm start
```

Server runs at:
👉 http://localhost:5000

#### Start Frontend
```bash
cd ../client
npm run dev
```

Client runs at:
👉 http://localhost:5173

---

### ⚡ Optional: One-Command Startup

Use the provided script:

```bash
./ignite.sh
```

---

## 🌍 Deployment

### 🖥️ Client (Netlify)

1. Push `web-prototype/client` to GitHub
2. Connect to Netlify
3. Build command:
   ```
   npm run build
   ```
4. Publish directory:
   ```
   dist
   ```

---

### 🧠 Server (Render)

1. Push repository to GitHub
2. Create new Web Service on Render
3. Set root directory:
   ```
   web-prototype/server
   ```
4. Build command:
   ```
   npm install
   ```
5. Start command:
   ```
   node index.js
   ```
6. Environment variable:
   ```
   PORT=5000
   ```

---

## 🔌 API Endpoints

- `POST /upload`  
  Upload image (sender)

- `GET /drop/:receiverId`  
  Retrieve image (receiver)

---

## 🧪 Usage Flow

1. Open the frontend in browser
2. Upload an image
3. Perform **GRAB** gesture to send
4. On another session/device:
   - Perform **DROP** gesture to receive

---

## 🧠 Tech Stack

- **Frontend**
  - React
  - Vite
  - Tailwind CSS
  - ml5.js
  - Teachable Machine

- **Backend**
  - Express.js
  - Multer
  - CORS

---

## ❓ FAQ

### Webcam not working?
- Ensure camera permissions are enabled
- Check browser console for errors

### Gesture not detected?
- Improve lighting conditions
- Keep hand clearly visible
- Retrain model if needed

### Image not transferring?
- Verify backend is running
- Check API URL configuration
- Ensure CORS is properly set