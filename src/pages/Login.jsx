import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de mantener esta importación para los enlaces
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

function Login() {
  const [credentials, setCredentials] = useState({ correo: '', contraseña: '' });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Cerrar sesión automáticamente al cargar la página de Login
    signOut(auth).catch(error => {
      console.error("Error al cerrar sesión", error);
      // No es necesario mostrar un toast aquí, pero podrías hacerlo si lo consideras necesario.
    });
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.correo, credentials.contraseña);
      const userId = userCredential.user.uid;
      const db = getFirestore();
      const userRef = doc(db, "usuarios", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userRole = userSnap.data().rol;
        localStorage.setItem('userRole', userRole);

        if (userRole === 'docente') {
          navigate("/Teacher");
        } else if (userRole === 'alumno') {
          navigate("/home");
        } else {
          toast.error("Rol de usuario no definido.");
        }
      } else {
        toast.error("No se encontró el documento del usuario.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      toast.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    }
  };

  return (
    <div className="login">
      <motion.div className="form-login" variants={container} initial="hidden" animate="visible">
        <motion.h2 variants={item}>Iniciar Sesión</motion.h2>
        <form onSubmit={handleSubmit}>
          <motion.input
            type="email"
            name="correo"
            placeholder="Correo"
            onChange={handleChange}
            required
            variants={item}
            whileFocus={{ scale: 1.1 }}
          />
          <motion.input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            variants={item}
            whileFocus={{ scale: 1.1 }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={item}
          >
            Iniciar Sesión
          </motion.button>
        </form>
        <ToastContainer />
        <motion.div variants={item} className='create-acount'>
          <Link to="/register">Crear Cuenta</Link>
        </motion.div>
        <motion.div variants={item}>
          <Link to="/forgot-password" className='nip'>Olvidé mi contraseña</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
