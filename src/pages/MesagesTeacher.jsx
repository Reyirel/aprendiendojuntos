import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que este hook está implementado correctamente

function MessagesTeacher() {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [lecciones, setLecciones] = useState([]);
  const [selectedLeccion, setSelectedLeccion] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchCursos = async () => {
      // Asumiendo que hay una colección "cursos" y cada curso tiene un campo "instructor"
      const q = query(collection(db, "cursos"), where("instructor", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      setCursos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    if (currentUser) {
      fetchCursos();
    }
  }, [currentUser, db]);

  useEffect(() => {
    const fetchLecciones = async () => {
      if (selectedCurso) {
        // Asumiendo que las lecciones están en una subcolección del curso seleccionado
        const leccionesRef = collection(db, "cursos", selectedCurso, "lecciones");
        const querySnapshot = await getDocs(leccionesRef);
        setLecciones(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchLecciones();
  }, [selectedCurso, db]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (selectedCurso) {
        // Obtiene el documento del curso para leer la lista de estudiantes
        const cursoRef = doc(db, "cursos", selectedCurso);
        const cursoSnap = await getDoc(cursoRef);
        if (cursoSnap.exists()) {
          const estudiantesIds = cursoSnap.data().estudiantes;
          const estudiantesPromises = estudiantesIds.map(id => getDoc(doc(db, "usuarios", id)));
          const estudiantesDocs = await Promise.all(estudiantesPromises);
          setAlumnos(estudiantesDocs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      }
    };

    fetchAlumnos();
  }, [selectedCurso, db]);

  const handleSendMessage = () => {
    // Aquí implementarías la lógica para enviar el mensaje al alumno seleccionado
    console.log(`Enviar mensaje a ${selectedAlumno} sobre la lección ${selectedLeccion} del curso ${selectedCurso}`);
  };

  return (
    <div>
      <h1>Enviar Mensaje a Alumno</h1>
      <select value={selectedCurso} onChange={e => setSelectedCurso(e.target.value)}>
        <option value="">Selecciona un curso</option>
        {cursos.map(curso => (
          <option key={curso.id} value={curso.id}>{curso.nombre}</option>
        ))}
      </select>
      <select value={selectedLeccion} onChange={e => setSelectedLeccion(e.target.value)}>
        <option value="">Selecciona una lección</option>
        {lecciones.map(leccion => (
          <option key={leccion.id} value={leccion.id}>{leccion.nombre}</option>
        ))}
      </select>
      <select value={selectedAlumno} onChange={e => setSelectedAlumno(e.target.value)}>
        <option value="">Selecciona un alumno</option>
        {alumnos.map(alumno => (
          <option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>
        ))}
      </select>
      <button onClick={handleSendMessage}>Enviar Mensaje</button>
    </div>
  );
}

export default MessagesTeacher;
