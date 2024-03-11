import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/MessagesTeacher.css';

function MessagesTeacher() {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [lecciones, setLecciones] = useState([]);
  const [selectedLeccion, setSelectedLeccion] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchCursos = async () => {
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
        const q = query(collection(db, "lecciones"), where("cursoId", "==", selectedCurso));
        const querySnapshot = await getDocs(q);
        setLecciones(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchLecciones();
  }, [selectedCurso, db]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (selectedCurso) {
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

  const handleSendMessage = async () => {
    try {
      await addDoc(collection(db, "mensajes"), {
        cursoId: selectedCurso,
        leccionId: selectedLeccion,
        alumnoId: selectedAlumno,
        mensaje: mensaje,
        enviadoPor: currentUser.uid,
        timestamp: new Date(),
      });
      toast.success('Mensaje enviado con éxito');
      setMensaje(''); // Limpiar el campo de mensaje después de enviar
    } catch (error) {
      console.error("Error enviando el mensaje: ", error);
      toast.error('Error al enviar el mensaje');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Enviar Mensaje a Alumno</h1>
      <div className="formulario-mensajes">
        <div className="secciones">

          <select value={selectedCurso} onChange={e => setSelectedCurso(e.target.value)}>
            <option value="">Selecciona un curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>{curso.nombre}</option>
            ))}
          </select>
          <select value={selectedLeccion} onChange={e => setSelectedLeccion(e.target.value)}>
            <option value="">Selecciona una lección</option>
            {lecciones.map(leccion => (
              <option key={leccion.id} value={leccion.id}>{leccion.titulo}</option>
            ))}
          </select>
          <select value={selectedAlumno} onChange={e => setSelectedAlumno(e.target.value)}>
            <option value="">Selecciona un alumno</option>
            {alumnos.map(alumno => (
              <option key={alumno.id} value={alumno.id}>{alumno.nombre} {alumno.apellidos}</option>
            ))}
          </select>
          <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Escribe tu mensaje aquí"></textarea>
          <button onClick={handleSendMessage}>Enviar Mensaje</button>
        </div>
      </div>
    </div>
  );
}

export default MessagesTeacher;
