import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/Card.css';

const db = getFirestore();

function Card({ curso, onActionButtonClick, actionButtonText = "Inscribirse", showActionButton = true, showCourseLink = false }) {
  const [instructorName, setInstructorName] = useState('');

  useEffect(() => {
    const fetchInstructorName = async () => {
      try {
        const docRef = doc(db, "usuarios", curso.instructor);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInstructorName(docSnap.data().nombre);
        } else {
          console.log("No se encontró el documento del instructor!");
        }
      } catch (error) {
        console.error("Error al obtener el documento:", error);
      }
    };

    fetchInstructorName();
  }, [curso.instructor]);

  return (
    <div className="card">
      <h3 className="card-title">{curso.nombre}</h3>
      <p className="card-description">{curso.descripcion}</p>
      <p className="card-instructor">Profesor: {instructorName}</p>
      {showActionButton && <button onClick={() => onActionButtonClick(curso.id)}>{actionButtonText}</button>}
      {showCourseLink && <Link to={`/course/${curso.id}`} className="go-to-course-btn">Ir al curso</Link>}
    </div>
  );
}

export default Card;

