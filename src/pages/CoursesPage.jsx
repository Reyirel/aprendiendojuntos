import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

function CoursesPage() {
  const [cursos, setCursos] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCursos = async () => {
      const querySnapshot = await getDocs(collection(db, "cursos"));
      const cursosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCursos(cursosData);
    };

    fetchCursos();
  }, []);

  const inscribirseEnCurso = async (cursoId) => {
    if (!currentUser) return;

    const userRef = doc(db, "usuarios", currentUser.uid);
    await updateDoc(userRef, {
      cursosInscritos: arrayUnion(cursoId)
    });

    // Actualizar la interfaz de usuario si es necesario
  };

  return (
    <div>
      <h1>Todos los Cursos</h1>
      <div className="cursos-lista">
        {cursos.map(curso => (
          <div key={curso.id}>
            <Card title={curso.titulo} description={curso.descripcion} image={curso.imagen} />
            <button onClick={() => inscribirseEnCurso(curso.id)}>Inscribirse</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
