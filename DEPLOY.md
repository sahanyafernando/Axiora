# Full-Stack Deployment Guide (No Credit Card Required)

Axiora is now a full-stack application. To avoid credit card requirements, we will deploy the **entire project (Frontend + Backend)** to **Vercel** and use **MongoDB Atlas** for the database.

---

## **1. Set up your Database (MongoDB Atlas)**
MongoDB Atlas offers a generous free tier for storage and **does not require a credit card**.
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (M0 Free Tier).
3. Under **"Network Access"**, allow access from anywhere (`0.0.0.0/0`).
4. Under **"Database Access"**, create a user and password.
5. Get your **Connection String**. It will look like: `mongodb+srv://<user>:<password>@cluster.mongodb.net/axiora`.

---

## **2. Deploy to Vercel (Unified Deployment)**
Vercel can host both your React frontend and your Express backend together as a single project.
1. Create a free account at [Vercel](https://vercel.com/) (**No credit card required**).
2. Push your code to a GitHub repository.
3. In Vercel, click **"Add New"** -> **"Project"**.
4. Import your GitHub repository.
5. **Configuration**:
   - **Framework Preset**: Vite (detected automatically).
   - **Root Directory**: `.` (the project root).
6. **Environment Variables**:
   - Add `MONGODB_URI`: Your MongoDB Atlas connection string.
   - Add `VITE_API_URL`: `/api` (this tells the frontend to use the same domain).
   - Add `NODE_ENV`: `production`.
7. Click **"Deploy"**.

---

## **How it Works (Architecture)**
- **Frontend**: The React app is built and served as static files.
- **Backend**: The [api/index.js](file:///d:/Axiora/api/index.js) file is treated by Vercel as a **Serverless Function**.
- **Routing**: The [vercel.json](file:///d:/Axiora/vercel.json) file routes all `/api/*` requests to the backend logic.

---

## **Local Testing with Docker Compose**

You can still test the entire stack locally with Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **MongoDB**: Internal container.
