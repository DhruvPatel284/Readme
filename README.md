# Readme - Blog Website

Welcome to **Readme**, a blog website where users can share their ideas and thoughts by publishing their own blogs. Users can view all blogs, update, and delete their own blogs. Each blog displays the publication date and estimated reading time.

## 📚 Table of Contents
- [Project Demo](#-project-demo)
- [Project Overview](#-project-overview)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Features in Detail](#-features-in-detail)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎥 Project Demo

[Watch the Demo Video](#)  
(*Link to your video here*)

## 🚀 Project Overview

**Readme** is a full-stack web application built with modern technologies to provide a seamless blogging experience. Users can sign up, log in, and manage their blogs with ease. The platform also calculates the reading time for each blog based on the word count, helping readers to manage their time better.

### Key Features:
- **User Authentication**: Users can sign up, sign in, and manage their session.
- **Blog Creation**: Users can create, publish, update, and delete their blogs.
- **View All Blogs**: A section where users can view all published blogs.
- **Reading Time**: Display of estimated reading time for each blog.
- **Personalized Dashboard**: A 'My Blogs' section where users can manage their content.

## 🛠️ Technologies Used

### Frontend:
- **React.js**: For building the user interface
- **TypeScript**: Strongly-typed JavaScript for better development experience
- **CSS**: Styling the components

### Backend:
- **Hono**: Lightweight framework for building web APIs
- **Prisma ORM**: For interacting with the PostgreSQL database
- **PostgreSQL**: The relational database used to store user and blog information
- **Node.js**: Backend runtime for executing JavaScript code
- **Cloudflare**: For deployment and scaling the backend services

## 🏗️ Project Structure

Here's a breakdown of the core structure:

- **Frontend**: `/frontend`
  - `src/components`: Contains all React components for the UI
  - `src/pages`: Different routes for your app like home, blog, and login pages

- **Backend**: `/backend`
  - `src/routes`: API routes for handling user and blog-related requests
  - `src/models`: Database models using Prisma ORM

- **Database**: PostgreSQL is used for persistent storage.

## 🚀 Getting Started

### Prerequisites:
- **Node.js** (v16+)
- **PostgreSQL** (v13+)
- **Git**

### Step-by-Step Setup:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/readme-blog.git
   cd readme-blog
2. **Setup Backend**:
  - Go to the backend directory:
       ```bash
        cd backend
  - Install the backend dependencies:
       ```bash
        npm install
  - Setup the PostgreSQL database:
      - Create a PostgreSQL database and update the connection string in the .env file:
           ```bash
            DATABASE_URL=postgresql://user:password@localhost:5432/your-database-name
  - Run the database migrations using Prisma:
       ```bash
        npx prisma migrate dev
  - Add the JWT secret to the .env file:
      ```bash
    JWT_SECRET=your_jwt_secret_key
  - Run the backend server:
       ```bash
        npm run dev
3. **Setup Frontend**:
  - Go to the frontend directory:
       ```bash
        cd frontend
  - Go to the frontend directory:
       ```bash
        npm install
  - Setup the backend URL in the config.ts file:
       ```bash
        export const BACKEND_URL = "http://localhost:3000"; // Your local backend URL
  - Run the frontend:
       ```bash
        npm run dev
3. **Setup Frontend**:
  - Open your browser and visit the following URLs:
       - **Frontend**: http://localhost:3000
        - **backend**: http://localhost:4000
4. **📂 Environment Variables**:
  - You need to set up the following environment variables in your .env file for the backend:
       ```bash
        DATABASE_URL=postgresql://user:password@localhost:5432/your-database-name
        JWT_SECRET=your_jwt_secret_key
   - Additionally, update the BACKEND_URL in the frontend's config.ts file for API requests:
       ```bash
        export const BACKEND_URL = "http://localhost:3000"; // Your backend URL
---
### **📝 Features in Detail**:
   1.**Authentication:** Built using JWT tokens. Cookies are used for maintaining the user session.

   2.**Blog Management:** Users can create blogs from their dashboard. They can view their published blogs in the "My Blogs" section.

   3.**Reading Time:** Automatically calculates the reading time of a blog based on the word count and displays it on the blog card.
   
   4.**Responsive Design:** The website is responsive and mobile-friendly.

---
### 🌐 Deployment
#### Backend (Cloudflare Worker):
     1. Set DATABASE_URL in .env and wrangler.toml.
     2. Set JWT_SECRET in wrangler.toml.
     3. Deploy using Wrangler.
     
#### Frontend (Vercel):
     1. Deploy the frontend to Vercel.
     2. Set BACKEND_URL in the config.ts file to point to the Cloudflare Worker URL.

---
     
### **🤝 Contributing**:
If you would like to contribute to this project, feel free to submit a pull request. For any issues, please open an issue on the GitHub repository.


  
   