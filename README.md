# Task Management System

A comprehensive task management application built with modern web technologies, featuring intelligent task assignment, real-time collaboration, and conflict resolution.

## 🚀 Project Overview

This task management system provides teams with powerful tools to organize, assign, and track tasks efficiently. The application includes smart assignment algorithms that automatically distribute workload fairly among team members, and robust conflict handling to manage concurrent edits in real-time collaborative environments.

### Key Highlights
- **Smart Task Assignment**: Automatically assigns tasks to the least busy team member
- **Real-time Collaboration**: Multiple users can work simultaneously with conflict resolution
- **Intuitive Interface**: Clean, responsive design for seamless user experience
- **Comprehensive Task Management**: Full CRUD operations with status tracking
- **Team Management**: Board-based organization with member management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - Frontend framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates
- **Tailwind CSS** - Styling framework
- **React Hook Form** - Form handling
- **React Query** - Server state management

### Development Tools
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🔧 Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanagement
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Socket.io Configuration
SOCKET_PORT=5001
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 5. Configure Frontend Environment

Edit the `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# App Configuration
REACT_APP_NAME=Task Management System
REACT_APP_VERSION=1.0.0
```

### 6. Database Setup

If using local MongoDB:

```bash
# Start MongoDB service
mongod

# (Optional) Create database and initial data
# The application will create collections automatically
```

For MongoDB Atlas:
1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a database user
3. Whitelist your IP address
4. Use the connection string in your `.env` file

### 7. Running the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Option 2: Run Both Concurrently (from root directory)

```bash
# Install concurrently globally (if not installed)
npm install -g concurrently

# Run both backend and frontend
npm run dev
```

Add this script to your root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd backend && npm run dev",
    "client": "cd frontend && npm start"
  }
}
```

### 8. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if Swagger is configured)

## 🎯 Features

### Core Features

#### 1. **User Authentication**
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware

#### 2. **Board Management**
- Create, read, update, delete boards
- Board membership management
- Board-specific task organization
- Member permissions and roles

#### 3. **Task Management**
- Create tasks with detailed information
- Task status tracking (Todo, In Progress, Done)
- Task assignment to team members
- Task priority levels
- Due date management
- Task descriptions and comments

#### 4. **Smart Assignment System**
- Automatic task assignment based on workload
- Fair distribution algorithm
- Real-time workload calculation
- Override capability for manual assignment

#### 5. **Real-time Collaboration**
- Live updates across all connected clients
- Real-time task status changes
- Instant notifications for task updates
- Collaborative editing with conflict resolution

#### 6. **Conflict Resolution**
- Optimistic locking for concurrent edits
- Version control for task updates
- Automatic conflict detection
- User-friendly conflict resolution interface

### Advanced Features

#### 7. **Dashboard Analytics**
- Task completion statistics
- Team performance metrics
- Workload distribution charts
- Progress tracking and reporting

#### 8. **Responsive Design**
- Mobile-friendly interface
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Cross-browser compatibility

## 📖 Usage Guide

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Create a Board**: Set up a new project board
3. **Invite Members**: Add team members to your board
4. **Create Tasks**: Add tasks with descriptions, priorities, and due dates
5. **Assign Tasks**: Use smart assignment or manually assign tasks
6. **Track Progress**: Monitor task status and team performance

### Creating a Task

1. Click "Add Task" button
2. Fill in task details:
   - Title (required)
   - Description
   - Priority level
   - Due date
   - Labels/tags
3. Choose assignment method:
   - Smart Assign (recommended)
   - Manual assignment
4. Click "Create Task"

### Managing Board Members

1. Go to Board Settings
2. Click "Manage Members"
3. Add members by email or username
4. Set member permissions
5. Save changes

### Using Smart Assignment

1. When creating a task, select "Smart Assign"
2. The system automatically assigns to the least busy member
3. Assignment is based on active task count
4. Manual override available if needed

## 🧠 Smart Assign Logic

The Smart Assignment feature automatically distributes tasks fairly among team members based on their current workload.

### Algorithm Overview

```javascript
const getSmartAssignedUser = async (boardId) => {
  // 1. Get all board members
  const board = await Board.findById(boardId).populate('members');
  
  // 2. Count active tasks for each member
  const activeTaskCounts = await Task.aggregate([
    {
      $match: {
        boardId: new mongoose.Types.ObjectId(boardId),
        status: { $in: ["todo", "in-progress"] },
        assignedTo: { $in: board.members.map(m => m._id) }
      }
    },
    {
      $group: {
        _id: "$assignedTo",
        count: { $sum: 1 }
      }
    }
  ]);
  
  // 3. Create task count map (default 0 for all members)
  const taskCountMap = new Map(
    board.members.map(user => [user._id.toString(), 0])
  );
  
  // 4. Update map with actual counts
  activeTaskCounts.forEach(({ _id, count }) => {
    taskCountMap.set(_id.toString(), count);
  });
  
  // 5. Find member with fewest tasks
  const leastBusy = [...taskCountMap.entries()]
    .sort((a, b) => a[1] - b[1])[0];
  
  return board.members.find(
    user => user._id.toString() === leastBusy[0]
  );
};
```

### Key Features

1. **Fair Distribution**: Considers only active tasks (todo, in-progress)
2. **Inclusive Counting**: Members with zero tasks are included
3. **Efficient Querying**: Uses MongoDB aggregation for performance
4. **Real-time Updates**: Recalculates on every assignment request

### Benefits

- **Workload Balance**: Prevents task overload on individual members
- **Automatic Efficiency**: Reduces manual assignment overhead
- **Team Productivity**: Optimizes resource utilization
- **Scalability**: Works efficiently with large teams

## ⚔️ Conflict Handling Logic

The conflict resolution system manages concurrent edits in real-time collaborative environments.

### Conflict Detection

```javascript
// Version-based conflict detection
const updateTaskWithConflictCheck = async (taskId, updates, currentVersion) => {
  const task = await Task.findById(taskId);
  
  if (task.version !== currentVersion) {
    throw new ConflictError({
      message: 'Task has been modified by another user',
      currentData: task,
      attemptedChanges: updates
    });
  }
  
  // Increment version on successful update
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { 
      ...updates, 
      version: task.version + 1,
      lastModified: new Date()
    },
    { new: true }
  );
  
  // Broadcast changes to all connected clients
  io.to(`board:${task.boardId}`).emit('taskUpdated', updatedTask);
  
  return updatedTask;
};
```

### Conflict Resolution Strategies

#### 1. **Optimistic Locking**
- Each task has a version number
- Updates include version check
- Conflicts detected when versions don't match
- Failed updates trigger conflict resolution UI

#### 2. **Real-time Synchronization**
- Socket.io for instant updates
- All clients receive change notifications
- UI reflects changes immediately
- Conflict indicators for simultaneous edits

#### 3. **User-Friendly Resolution**
- Conflict resolution modal
- Side-by-side comparison of changes
- Options to merge, overwrite, or cancel
- Automatic conflict highlighting

### Implementation Example

```javascript
// Frontend conflict handling
const handleTaskUpdate = async (taskId, updates) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, {
      ...updates,
      version: currentTask.version
    });
    
    dispatch(updateTaskSuccess(response.data));
  } catch (error) {
    if (error.response?.status === 409) {
      // Conflict detected
      dispatch(showConflictModal({
        taskId,
        currentData: error.response.data.currentData,
        attemptedChanges: updates,
        onResolve: (resolution) => {
          // Handle user's conflict resolution choice
          resolveConflict(taskId, resolution);
        }
      }));
    }
  }
};
```

### Benefits

1. **Data Integrity**: Prevents data loss from concurrent edits
2. **User Experience**: Clear conflict indication and resolution
3. **Real-time Updates**: Instant synchronization across clients
4. **Scalability**: Handles multiple simultaneous users efficiently

## 🌐 Deployment

### Live Application
🔗 **[Task Management System - Live Demo](https://your-app-domain.com)**

### Demo Video
📹 **[Watch Demo Video](https://your-demo-video-link.com)**

### Backend Deployment (Heroku/Railway/Vercel)

1. Create a new app on your platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the backend

### Frontend Deployment (Netlify/Vercel)

1. Build the React app: `npm run build`
2. Deploy the build folder
3. Configure API endpoints
4. Set up domain and SSL

### Environment Variables for Production

```env
# Backend Production
NODE_ENV=production
PORT=443
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-frontend-domain.com

# Frontend Production
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **[Your Name]** - Full Stack Developer
- **[Team Member 2]** - Frontend Developer
- **[Team Member 3]** - Backend Developer

## 🐛 Known Issues

- Socket.io connection may timeout on slow networks
- Large file uploads not yet supported
- Mobile notifications require additional setup

## 🔮 Future Enhancements

- [ ] File attachment support
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Third-party integrations (Slack, GitHub)
- [ ] Advanced analytics dashboard
- [ ] Custom workflow automation

## 📞 Support

For support, email support@yourdomain.com or create an issue in the GitHub repository.

---

**Made with ❤️ by [Your Team Name]**
