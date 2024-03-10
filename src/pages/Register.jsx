import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../firebase-config'; // Asegúrate de tener esta exportación en tu configuración de Firebase
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Register.css';

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

function Register() {
  const [user, setUser] = useState({ nombre: '', apellidos: '', correo: '', contraseña: '', rol: '' });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    signOut(auth);
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.correo, user.contraseña);
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol, // Asegúrate de guardar el rol del usuario como 'docente' o 'alumno'
      });
      navigate("/login");
      toast.success("Usuario registrado con éxito");
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      let mensajeError = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          mensajeError = "El correo electrónico ya está en uso por otra cuenta.";
          break;
        case "auth/weak-password":
          mensajeError = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
          break;
        case "auth/invalid-email":
          mensajeError = "El correo electrónico no es válido.";
          break;
        default:
          mensajeError = "Ocurrió un error al registrar el usuario. Intente de nuevo más tarde.";
      }
      toast.error(mensajeError);
    }
  };

  return (
    <motion.div className="register-container" variants={container} initial="hidden" animate="visible">
      <form onSubmit={handleSubmit}>
        <motion.h2 variants={item}>Registro</motion.h2>
        <motion.input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required variants={item} whileFocus={{ scale: 1.1 }} />
        <motion.input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required variants={item} whileFocus={{ scale: 1.1 }} />
        <motion.input type="email" name="correo" placeholder="Correo" onChange={handleChange} required variants={item} whileFocus={{ scale: 1.1 }} />
        <motion.input type="password" name="contraseña" placeholder="Contraseña" onChange={handleChange} required variants={item} whileFocus={{ scale: 1.1 }} />
        <motion.select name="rol" onChange={handleChange} required variants={item} whileFocus={{ scale: 1.1 }}>
          <option value="">Selecciona tu rol</option>
          <option value="docente">Docente</option>
          <option value="alumno">Alumno</option>
        </motion.select>
        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} variants={item}>Registrar</motion.button>
        <motion.div variants={item}>
          <Link to="/login">Ya tengo una cuenta</Link>
        </motion.div>
      </form>
      <ToastContainer />
    </motion.div>
  );
}

export default Register;
