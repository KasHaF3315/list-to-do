# TodoApp Setup Guide for New Computers

This guide will help you set up the TodoApp on any new computer or VS Code environment.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **VS Code** (optional but recommended)
- **Git** (for cloning the repository)

## Step-by-Step Setup

### 1. Clone/Copy the Project
```bash
# If using Git
git clone <your-repository-url>
cd ToDoList

# Or simply copy the entire ToDoList folder to the new computer
```

### 2. Install Frontend Dependencies
```bash
# In the root directory (ToDoList/)
npm install
```

### 3. Install Backend Dependencies
```bash
# Navigate to backend directory
cd backend
npm install
cd ..
```

### 4. Create Environment File
**IMPORTANT:** You must create the `.env` file manually on each new computer.

1. Navigate to the `backend/` folder
2. Copy `.env.example` to `.env`:
   ```bash
   # In backend/ directory
   copy .env.example .env
   ```
3. The `.env` file should contain:
   ```
   # MongoDB Atlas Configuration
   MONGODB_URI=mongodb+srv://KASHAFBASHIR:KASHAF@qm.jo9zpcz.mongodb.net/todoapp?retryWrites=true&w=majority

   # JWT Secret Key
   JWT_SECRET=89ca7f4693f204c32a3f0f291cf8cb0a0a89cd1cb3db98c96d50d563a3f7c02c

   # Server Port
   PORT=5000
   ```

### 5. Start the Application

#### Option A: Using Batch Files (Windows)
```bash
# Start backend (in one terminal)
start-backend.bat

# Start frontend (in another terminal)
start-frontend.bat
```

#### Option B: Manual Start
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend (new terminal)
npm run dev
```

### 6. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Make sure you installed dependencies for both frontend and backend:
```bash
# Root directory
npm install

# Backend directory
cd backend
npm install
```

### Issue 2: Backend not connecting to MongoDB
**Solution:** Verify your `.env` file exists in the `backend/` directory with correct MongoDB credentials.

### Issue 3: Port already in use
**Solution:** 
- Kill processes using ports 3000 or 5000
- Or change ports in the configuration files

### Issue 4: VS Code not recognizing the project
**Solution:**
1. Open VS Code
2. File → Open Folder → Select the entire `ToDoList` folder
3. Install recommended extensions when prompted

## VS Code Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## Troubleshooting Checklist

- [ ] Node.js installed (check with `node --version`)
- [ ] npm installed (check with `npm --version`)
- [ ] Frontend dependencies installed (`node_modules` exists in root)
- [ ] Backend dependencies installed (`node_modules` exists in `backend/`)
- [ ] `.env` file created in `backend/` directory
- [ ] MongoDB connection string is correct
- [ ] Ports 3000 and 5000 are available
- [ ] Both frontend and backend servers are running

## Quick Start Script

For convenience, you can run this complete setup:

```bash
# Run from the ToDoList root directory
npm install
cd backend
npm install
copy .env.example .env
echo "Setup complete! Now start both servers:"
echo "1. Run 'start-backend.bat' in one terminal"
echo "2. Run 'start-frontend.bat' in another terminal"
```

## Need Help?

If you're still experiencing issues:
1. Check that all dependencies are installed
2. Verify the `.env` file exists and has correct content
3. Ensure both servers are running on different ports
4. Check the browser console for any error messages
