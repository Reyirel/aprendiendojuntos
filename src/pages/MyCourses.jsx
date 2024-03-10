import React, { useState, useEffect, useContext } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

function MyCourses() {
  const [cursos, setCursos] = useState([]);
  const db = getFirestore();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCursos = async () => {
      const querySnapshot = await getDocs(collection(db, "cursos"));
      const filteredCursos = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(curso => curso.instructor === currentUser.uid);
      setCursos(filteredCursos);
    };

    fetchCursos();
  }, [db, currentUser.uid]);
  
  return (
    <div>
      <h1>Mis Cursos</h1>
      {cursos.map(curso => (
        <Card
          key={curso.id}
          curso={curso}
          actionButtonText="Ir a mi curso"
          onActionButtonClick={(cursoId) => navigate(`/course/${cursoId}`)}
          showActionButton={true}
          showCourseLink={true}
        />
      ))}
    </div>
  );
}

export default MyCourses;

