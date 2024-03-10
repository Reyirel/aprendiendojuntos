import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Calendar from './pages/Calendar';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses'; // Componente para docentes
import CreateCourse from './pages/CreateCourse'; // Componente para docentes
import Course from './pages/Course'; // Nuevo componente para detalles del curso
import Navbar from './components/Navbar';
import './styles/App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function Layout() {
  const location = useLocation();
  const { currentUser, userRole } = useAuth();
  const noNavbarRoutes = ['/login', '/register'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
        {userRole === 'docente' && (
          <>
            <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
            <Route path="/create-course" element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
          </>
        )}
        <Route path="/course/:courseId" element={<PrivateRoute><Course /></PrivateRoute>} /> {/* Nueva ruta para detalles del curso */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;


