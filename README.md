# Ruthy Eatery - Restaurant Management System

A professional, full-stack restaurant website and management platform with a visual menu, ordering system, table reservations, and a comprehensive admin dashboard.

## 🚀 Live Demo Features
- **Public Website**: Visual menu with Philippine Pesos (₱), Cart, Checkout, and Story.
- **User Dashboard**: Track orders and table bookings.
- **Admin Dashboard**: Manage menu categories, items, users, messages, and branding.
- **Tech Stack**: React, Tailwind CSS, Node.js, Aiven MySQL.

---

## 🛠️ Step 1: Database Setup (Aiven & MySQL Workbench)

1. **Create Aiven Account**: Sign up at [aiven.io](https://aiven.io).
2. **Launch MySQL Service**: Create a new MySQL service (the free tier works perfectly).
3. **Get Connection URI**: Once the service is running, copy the **MySQL URI** (it starts with `mysql://`).
4. **Connect via MySQL Workbench**:
   - Open MySQL Workbench.
   - Click the **+** icon for a new connection.
   - Select **"Connection Method: Standard (TCP/IP over SSH)"** or use the URI string provided by Aiven.
   - Test connection to ensure your cloud database is live.
5. **Aiven URL**: Save this URL; you will need it for Render environment variables.
6. **Apply Schema**: Run the SQL commands in `schema.sql` inside MySQL Workbench to create the necessary tables.

---

## 💻 Step 2: GitHub Upload

1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ruthy Eatery"
   ```
2. **Create Repository**: Go to GitHub and create a new repository named `ruthy-eatery`.
3. **Push Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ruthy-eatery.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Step 3: Backend Deployment (Render)

1. **Create Web Service**: In [Render](https://render.com), click **New +** -> **Web Service**.
2. **Connect Repo**: Connect your GitHub repository.
3. **Runtime Settings**:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**: Click **Advanced** and add:
   - `AIVEN_URL`: *[Paste your Aiven MySQL URI here]*
   - `PORT`: `3001`
5. **Deploy**: Render will automatically start your backend and provide a URL (e.g., `https://ruthy-api.onrender.com`).

---

## 🎨 Step 4: Frontend Deployment (Render)

1. **Create Static Site**: In Render, click **New +** -> **Static Site**.
2. **Connect Repo**: Connect the same GitHub repository.
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5. **Deploy**: Your website is now live!

---

## 🔑 Administrator Access

- **Admin Email**: `admin@gmail.com`
- **Admin Password**: `admin123`

---

## 📁 Project Structure

- `/src/pages/AdminDashboard.tsx`: Complete management suite (Orders, Users, Menu).
- `/src/pages/UserDashboard.tsx`: Customer portal for order history.
- `/src/components/Cart.tsx`: Shopping bag and checkout flow.
- `/server.js`: Node.js Express server with Aiven MySQL integration.
- `/src/services/backendService.ts`: Frontend API layer with local-storage fallback.

---

## 📝 License
This project is licensed under the MIT License - feel free to use it for your business!
