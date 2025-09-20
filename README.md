# 🛠️ ContractorConnect – Job Portal for Skilled Laborers & Contractors


## 📌 Project Overview

**ContractorConnect** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to bridge the gap between skilled laborers and contractors. It enables daily-wage workers, electricians, plumbers, and small contractors to connect, communicate, and collaborate efficiently. The platform also includes a built-in **tool rental module** and **real-time group chat**, offering a holistic digital experience for blue-collar job matching and coordination.

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Real-Time Communication | WebSockets (Socket.io) |
| State Management | React Context API / Redux (if used) |
| Authentication | JWT, Bcrypt |
| File Uploads | Multer (for resumes/images) |
| Hosting (if applicable) | Render / Vercel / MongoDB Atlas / Firebase Storage |

## 🚀 Features

### 👷 Worker Side
- ✅ Sign up and login with secure authentication
- 🔍 Search jobs based on location and profession
- 📩 Apply to multiple job postings
- 🧰 Tool rental listings and availability view
- 💬 Join group chats for projects or local work circles

### 🏗️ Contractor Side
- 📝 Post job requirements with profession & location filters
- 🔎 Search and shortlist available workers
- 📅 Manage job applicants and send offers
- 💬 Real-time group chat for team communication
- 🧰 Rent out tools with descriptions and pricing

### 💬 Common Features
- 🔐 JWT-based secure login
- 🌐 Responsive UI with Tailwind CSS
- 📡 Real-time messaging using WebSockets
- 📂 Resume/image uploads for worker profiles
- 📊 Dashboard for quick activity overview

## ⚙️ How We Built It

1. **Frontend Development**
   - Created reusable components using React.
   - Integrated dynamic routes and protected pages based on user role (worker/contractor).
   - Used Tailwind CSS for fast and responsive styling.

2. **Backend Development**
   - Designed RESTful APIs with Express.js for job posts, tool listings, user profiles, etc.
   - Implemented JWT-based authentication and role-based access control.
   - Used MongoDB with Mongoose for schema validation.

3. **Real-Time Chat**
   - Integrated **Socket.io** on both server and client for instant messaging.
   - Used room-based architecture for project-specific group chats.

4. **Tool Rental System**
   - CRUD system for posting, viewing, and managing tool listings.
   - Linked tool availability with worker/contractor profiles.

5. **Deployment (Optional if done)**
   - Frontend deployed on Vercel/Netlify
   - Backend and database hosted on Render/MongoDB Atlas



## 📚 Conclusion

This project was developed as a solution to real-world challenges faced by skilled laborers and contractors in finding trustworthy, quick, and local job opportunities. By integrating **job postings**, **tool rentals**, and **real-time communication** into one platform, ContractorConnect promotes a more **digitally connected** blue-collar workforce.

## 💡 Future Enhancements

- Push notifications for job offers
- Google Maps integration for location accuracy
- Rating & review system for workers and contractors
- Payment gateway integration for tool rentals
