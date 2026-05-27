# Team Task Manager

A full-stack web application designed for seamless team project and task management, featuring a stunning glassmorphism UI, role-based access control, and robust REST APIs.

## 🚀 Key Features

*   **Authentication & Role-Based Access:** Secure Login/Signup with `Admin` and `Member` roles using JWT.
*   **Project & Team Management:** Admins can create new projects and assign tasks to any registered team member.
*   **Task Assignment & Tracking:** Members can view their assigned tasks and update statuses (Pending, In Progress, Completed). Admins have full control over all tasks.
*   **Dynamic Dashboard:** Real-time overview of tasks, including statistics on total tasks, completed tasks, and overdue tasks.
*   **Stunning UI:** Premium, dark-themed, glassmorphic design utilizing CSS custom properties, responsive grids, and smooth animations.

## ⚙️ Tech Stack

*   **Frontend:** React, Vite, React Router, Axios, Lucide React (Icons), date-fns.
*   **Backend:** Node.js, Express.js.
*   **Database:** SQLite (Using `sqlite3` library).
*   **Security:** `bcryptjs` for password hashing, `jsonwebtoken` for secure API access.

## 💻 Local Development

1. **Clone the repository.**
2. **Install dependencies:**
   From the root directory, run:
   ```bash
   npm run postinstall
   ```
   This will install both client and server dependencies and build the React frontend.
3. **Start the application:**
   From the root directory, run:
   ```bash
   npm start
   ```
   The backend server will run on port 5000 and serve the React build. Open `http://localhost:5000` in your browser.

*Note: For active frontend development, you can open a separate terminal, navigate to `cd client` and run `npm run dev` to get Hot Module Replacement on `http://localhost:5173`.*

## 🌐 Railway Deployment Instructions

Deploying this app to Railway is incredibly simple due to the unified root `package.json`.

1. **Push to GitHub:** Push this complete folder to a new GitHub repository.
2. **Connect Vercel:**
   * Click **New Project** -> **Deploy from GitHub repo**.
   * Select your repository.
3. **Deploy:**
   * Vercel will automatically detect the root `package.json`.
   * It will run the `postinstall` script (which builds the React app) and then use the `start` script to run the Express server.
4. **Generate Domain:**
   * Once deployed, click on the service in Railway.
   * Go to **Settings** -> **Environment** -> **Public Networking** and click **Generate Domain**.
   * Your app is now live!

## 🧪 Testing the Application

1. Sign up a new user and select the **Admin** role.
2. Create a new **Project**.
3. Create a second user as a **Member**.
4. Log back in as Admin and create a Task in the project, assigning it to the Member.
5. Log in as the Member to see the task on your Dashboard and update its status!
