import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext'; // Asegúrate de que este hook está implementado correctamente
import Card from '../components/Card'; // Asegúrate de que este componente está implementado correctamente
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Courses.css';

function Courses() {
  const [cursos, setCursos] = useState([]);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cursos"));
        const cursosData = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        setCursos(cursosData);
      } catch (error) {
        console.error("Error al obtener los cursos: ", error);
        toast.error("Error al cargar los cursos. Por favor, inténtalo de nuevo.");
      }
    };

    fetchCursos();
  }, [db]);

  const handleInscribe = async (cursoId) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para inscribirte en un curso");
      return;
    }

    try {
      const cursoRef = doc(db, "cursos", cursoId);
      const cursoSnap = await getDoc(cursoRef);

      if (cursoSnap.exists()) {
        const cursoData = cursoSnap.data();
        if (cursoData.estudiantes && cursoData.estudiantes.includes(currentUser.uid)) {
          toast.info("Ya estás inscrito en este curso");
        } else {
          await updateDoc(cursoRef, {
            estudiantes: arrayUnion(currentUser.uid)
          });
          toast.success("Inscrito con éxito en el curso");
        }
      } else {
        toast.error("Curso no encontrado");
      }
    } catch (error) {
      console.error("Error al inscribirse en el curso: ", error);
      toast.error("Error al inscribirse en el curso. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className='all-course'>
      <h1>Todos los Cursos</h1>
      <div className="card-all-course">
        {cursos.map(curso => (
          <Card key={curso.id} curso={curso} onActionButtonClick={() => handleInscribe(curso.id)} actionButtonText="Inscribirse" showActionButton={true} />
        ))}
      </div>
      <ToastContainer limit={3} />
    </div>
  );
}

export default Courses;
