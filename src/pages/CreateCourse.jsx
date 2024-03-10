import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { useAuth } from '../context/AuthContext';

function CreateCourse() {
  const [course, setCourse] = useState({ nombre: '', descripcion: '' });
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cursos"), {
        nombre: course.nombre,
        descripcion: course.descripcion,
        instructor: currentUser.uid,
        estudiantes: [],
      });
      navigate("/my-courses");
    } catch (error) {
      console.error("Error al crear el curso:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nombre" placeholder="Nombre del Curso" onChange={handleChange} required />
      <input type="text" name="descripcion" placeholder="Descripción del Curso" onChange={handleChange} required />
      <button type="submit">Crear Curso</button>
    </form>
  );
}

export default CreateCourse;
