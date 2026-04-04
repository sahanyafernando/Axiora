# Full-Stack Deployment Guide

Axiora is now a full-stack application with a React frontend and a Node.js/Express backend.

---

## **Free Deployment via Render (Recommended)**

Render is ideal for this setup as it supports multiple services and a free PostgreSQL database (though we'll use MongoDB Atlas for the DB for better flexibility).

### **1. Set up your Database (MongoDB Atlas)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Free Tier).
3. Under **"Network Access"**, allow access from anywhere (`0.0.0.0/0`).
4. Under **"Database Access"**, create a user and password.
5. Get your **Connection String**.

### **2. Deploy the Backend**
1. Push your code to GitHub.
2. On Render, click **"New +"** -> **"Web Service"**.
3. Connect your repository.
4. Set the **Root Directory** to `server`.
5. **Runtime**: `Node`.
6. **Build Command**: `npm install`.
7. **Start Command**: `node index.js`.
8. Add **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `PORT`: `5000`.

### **3. Deploy the Frontend**
1. On Render, click **"New +"** -> **"Web Service"**.
2. Connect the same repository.
3. Set the **Root Directory** to `.` (the project root).
4. **Environment**: `Docker`.
5. Add **Environment Variables**:
   - `VITE_API_URL`: The URL of your newly deployed backend (e.g., `https://axiora-api.onrender.com/api`).

---

## **Local Testing with Docker Compose**

The easiest way to run the entire stack locally is with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- **Frontend** at [http://localhost](http://localhost)
- **Backend API** at [http://localhost:5000](http://localhost:5000)
- **MongoDB** internally at `mongodb://mongo:27017`

---

## **Key Full-Stack Files**

- [server/index.js](file:///d:/Axiora/server/index.js): The main entry point for the API.
- [src/context/AppContext.tsx](file:///d:/Axiora/src/context/AppContext.tsx): Updated to sync with the backend.
- [docker-compose.yml](file:///d:/Axiora/docker-compose.yml): Orchestrates all services.
