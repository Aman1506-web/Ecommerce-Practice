# 🛍️ Ecommerce Practice — Next.js + Convex + Clerk + Razorpay

## 🧠 Project Overview
This project was built to learn and practice backend integrations using modern full-stack tools.  
The focus is on **functionality** rather than UI — exploring how authentication, database, and payment systems work together inside a real application.

---

## 🧩 Tech Stack
- **Next.js 15 (App Router + TypeScript)** – Frontend framework  
- **Convex** – Backend-as-a-service for database, queries, and mutations  
- **Clerk** – Authentication and user management  
- **Zustand** – State management for guest cart  
- **Razorpay** – Payment gateway integration  
- **Tailwind CSS** – Utility-first styling  

---

## ⚙️ Core Features
- **Authentication with Clerk** – Login, signup, and role-based access (Admin/User)  
- **Convex Database**
  - Product CRUD  
  - Cart (Add, Remove, Update Quantity, Clear after payment)  
  - Orders (Saved automatically after successful payment)  
- **Razorpay Checkout**
  - Order creation from the frontend  
  - Payment verification on backend  
  - Order details saved in Convex  
- **Zustand Guest Cart** – Persistent cart for non-logged-in users, synced to Convex after sign-in  
- **Role-Based Routing** – Separate admin and user dashboards  
- **Minimal UI** – Clean interface to visualize backend flow  

---


## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Aman1506-web/Ecommerce-Practice.git
cd Ecommerce-Practice
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables

#### Create a .env.local file in the project root and add:
```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4️⃣ Run Development Server
```bash
npm run dev
```


### Visit http://localhost:3000 in your browser.


### 🧠 Learning Goals

- Understand how Next.js interacts with Convex backend
- Implement secure payments using Razorpay and handle verification
- Manage carts for both guest and authenticated users using Zustand + Convex
- Apply role-based access control with Clerk


### Next Steps:

- **Add Clerk** → Convex webhook for automatic user syncing
- **Add Razorpay** → Convex webhook for verified payment confirmation
- Improve UI/UX for production
- Add admin dashboard analytics


### 🌐 Deployment

- **Frontend & API Routes:** [Vercel](https://vercel.com)
- **Backend Database:** [Convex](https://convex.dev)
- **Auth:** [Clerk](https://clerk.com)
- **Payments:** [Razorpay](https://razorpay.com)


### 🔗 Live Demo

- **Website**: https://ecommerce-practice-two.vercel.app

- **Repository**: https://github.com/Aman1506-web/Ecommerce-Practice


---