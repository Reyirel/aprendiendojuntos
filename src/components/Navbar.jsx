import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta para tu proyecto
import logoImg from '../images/logo.png';
import '../styles/Navbar.css';

function Navbar() {
  const { currentUser, userRole, userName, logout } = useAuth(); // Accede al usuario actual, su rol, y nombre, así como la función de cierre de sesión desde el contexto
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout(); // Cierra la sesión del usuario
      navigate('/login'); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logoImg} alt="Logo" className="navbar-logo" />
      </Link>
      <div className="navbar-links">
        {userRole === 'docente' ? (
          <>
            <Link to="/Teacher">Inicio</Link>
            <Link to="/my-courses">Mis Cursos</Link>
            <Link to="/create-course">Crear Nuevo Curso</Link>
            <Link to="/messages-teacher">Mensajes</Link>
          </>
        ) : userRole === 'alumno' ? (
          <>
            <Link to="/home">Inicio</Link>
            <Link to="/messages">Mensajes</Link>
            <Link to="/calendar">Calendario</Link>
            <Link to="/courses">Todos los cursos</Link>
          </>
        ) : null}
        {currentUser && (
          <div className="navbar-user">
            <span>{userName || currentUser.email}</span> {/* Muestra el nombre del usuario si está disponible, de lo contrario el correo */}
            <button onClick={handleSignOut}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
