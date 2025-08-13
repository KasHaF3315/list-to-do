# Modern TodoApp - Next.js 14

A comprehensive, modern todo application built with Next.js 14, TypeScript, and cutting-edge libraries.

## 🚀 Features

### Core Functionality
- ✅ **Full CRUD Operations** - Create, read, update, delete todos
- 🔐 **Authentication System** - Login, signup, and guest access
- 🌙 **Dark Mode Support** - System, light, and dark themes
- 📱 **Responsive Design** - Works perfectly on all devices
- 💾 **Local Storage Persistence** - Data persists across sessions

### Advanced Features
- 🔍 **Smart Search & Filtering** - Search by title, description, or tags
- 📊 **Real-time Statistics** - Progress tracking and completion rates
- 🏷️ **Tag System** - Organize todos with custom tags
- 📅 **Due Dates** - Set and track deadlines
- ⚡ **Priority Levels** - Low, medium, high priority tasks
- 📂 **Categories** - Group todos by category
- 🎯 **Smart Sorting** - Sort by date, priority, or status

### User Experience
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 🔔 **Toast Notifications** - Real-time feedback
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- ⚡ **Fast Performance** - Optimized with Next.js 14
- 🔧 **Type Safety** - Full TypeScript integration

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### State Management & Validation
- **Zustand** - Lightweight state management
- **Zod** - Schema validation and type inference
- **React Hook Form** - Form handling with validation

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### Utilities
- **clsx** - Conditional className utility
- **date-fns** - Date manipulation library
- **use-debounce** - Debounced search inputs

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🚀 Quick Start

### For New Computers/VS Code Setup

1. **Run the complete setup script**
   ```bash
   complete-setup.bat
   ```

2. **Or follow manual steps:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Create environment file
   copy .env.example .env
   cd ..
   ```

3. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   start-backend.bat
   
   # Terminal 2 - Frontend  
   start-frontend.bat
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

### Important Notes
- **Environment File**: The `.env` file must be created manually on each new computer
- **Dependencies**: Both frontend and backend have separate `package.json` files
- **See SETUP_GUIDE.md** for detailed troubleshooting and cross-computer setup instructions

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   ├── todo/          # Todo-related components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions
│   ├── utils.ts       # General utilities
│   └── validations.ts # Zod schemas
├── store/             # Zustand stores
│   ├── authStore.ts   # Authentication state
│   ├── todoStore.ts   # Todo state management
│   └── themeStore.ts  # Theme management
└── types/             # TypeScript type definitions
    └── index.ts       # Shared types
```

## 🎯 Key Features Explained

### Authentication System
- **Login/Signup** with Zod validation
- **Password strength indicator** with real-time feedback
- **Confirm password** validation
- **Guest access** for quick testing
- **Persistent sessions** with Zustand

### Todo Management
- **Smart filtering** by status, category, and search terms
- **Advanced sorting** by date, priority, or completion
- **Tag system** for better organization
- **Due date tracking** with overdue indicators
- **Priority levels** with visual indicators

### Dark Mode
- **System preference** detection
- **Manual toggle** between light/dark
- **Persistent theme** selection
- **Smooth transitions** between themes

### Responsive Design
- **Mobile-first** approach
- **Tablet and desktop** optimized layouts
- **Touch-friendly** interactions
- **Accessible** design patterns

## 🔧 Configuration

### Tailwind CSS
Custom color palette and animations are configured in `tailwind.config.ts`:
- Primary colors (blue theme)
- Secondary colors (gray theme)
- Success, error, warning colors
- Custom animations (fade-in, slide-up, bounce-in)

### TypeScript
Strict TypeScript configuration with path aliases:
- `@/*` maps to `./src/*`
- Strict type checking enabled
- Modern ES features supported

## 📝 Usage Examples

### Creating a Todo
1. Click the "New Todo" button
2. Fill in the title and optional description
3. Set priority, category, and due date
4. Add tags for better organization
5. Click "Create Todo"

### Filtering and Search
- Use the search bar to find todos by title, description, or tags
- Filter by status: All, Active, or Completed
- Sort by creation date, priority, or due date
- Filter by category using the dropdown

### Theme Switching
- Click the theme toggle in the header
- Choose between Light, Dark, or System preference
- Theme preference is saved automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- All the open-source contributors

---

Built with ❤️ using modern web technologies
