import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, getDocs, doc, getFirestore, addDoc, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Course.css';

function Course() {
  const { courseId } = useParams();
  const [curso, setCurso] = useState(null);
  const [lecciones, setLecciones] = useState([]);
  const [numAlumnosInscritos, setNumAlumnosInscritos] = useState(0);
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: '', contenido: '' });
  const [leccionEditando, setLeccionEditando] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const db = getFirestore();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchCurso = async () => {
      const docRef = doc(db, "cursos", courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cursoData = docSnap.data();
        setCurso(cursoData);
        setNumAlumnosInscritos(cursoData.estudiantes ? cursoData.estudiantes.length : 0);
      } else {
        console.log("No se encontró el curso!");
      }
    };

    const fetchLecciones = async () => {
      const q = query(collection(db, "lecciones"), where("cursoId", "==", courseId));
      const querySnapshot = await getDocs(q);
      const leccionesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLecciones(leccionesData);
    };

    fetchCurso();
    fetchLecciones();
  }, [courseId, db]);

  const handleAddLeccion = async () => {
    if (nuevaLeccion.titulo.trim() && nuevaLeccion.contenido.trim()) {
      const newLeccionRef = await addDoc(collection(db, "lecciones"), {
        ...nuevaLeccion,
        cursoId: courseId
      });
      setLecciones([...lecciones, { id: newLeccionRef.id, ...nuevaLeccion, cursoId: courseId }]);
      setNuevaLeccion({ titulo: '', contenido: '' });
      toast.success('Lección agregada con éxito');
    }
  };

  const handleDeleteLeccion = async (leccionId) => {
    await deleteDoc(doc(db, "lecciones", leccionId));
    setLecciones(lecciones.filter(leccion => leccion.id !== leccionId));
    toast.success('Lección eliminada con éxito');
  };

  const handleEditLeccion = async () => {
    if (leccionEditando && leccionEditando.id) {
      const leccionRef = doc(db, "lecciones", leccionEditando.id);
      await updateDoc(leccionRef, {
        titulo: leccionEditando.titulo,
        contenido: leccionEditando.contenido,
      });
      setLecciones(lecciones.map(leccion => leccion.id === leccionEditando.id ? { ...leccion, ...leccionEditando } : leccion));
      setLeccionEditando(null);
      toast.success('Lección editada con éxito');
    }
  };

  const iniciarEdicion = (leccion) => {
    setLeccionEditando(leccion);
    setSelectedId(null); // Cierra la lección seleccionada si está abierta
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeccionEditando(prev => ({ ...prev, [name]: value }));
  };

  const cancelarEdicion = () => {
    setLeccionEditando(null);
  };

  if (!curso) return <div>Cargando...</div>;

  return (
    <div className='course-section'>

      <div className='course-info'>
        <h1>{curso.nombre}</h1>
        <p>{curso.descripcion}</p>
        {userRole === 'docente' && <p>Alumnos inscritos: {numAlumnosInscritos}</p>}
      </div>

    <div className="course-all">
      {userRole === 'docente' && (
        <div className='course-leccion'>

          <div className="course-leccion-add">

            {leccionEditando && (
              <div className='course-leccion-add-form'>
                <h1>Editar lección</h1>
                <input type="text" name="titulo" value={leccionEditando.titulo} onChange={handleChange} />
                <textarea name="contenido" value={leccionEditando.contenido} onChange={handleChange} />
                <button onClick={handleEditLeccion}>Guardar Cambios</button>
                <button onClick={cancelarEdicion}>Cancelar</button>
              </div>
            )}
            {!leccionEditando && (
              <div className='course-leccion-add-form'>
                <h1>Agregar lección</h1>
                <input
                  type="text"
                  placeholder="Título de la lección"
                  value={nuevaLeccion.titulo}
                  onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, titulo: e.target.value })}
                />
                <textarea
                  placeholder="Contenido de la lección"
                  value={nuevaLeccion.contenido}
                  onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, contenido: e.target.value })}
                />
                <button onClick={handleAddLeccion}>Añadir Lección</button>
              </div>
            )}
          </div>

        </div>
      )}

      <div className="course-leccion-map">
        <h1>Lecciones</h1>
        {lecciones.map((leccion) => (
          <motion.div
            key={leccion.id}
            layoutId={leccion.id}
            onClick={() => setSelectedId(leccion.id)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="leccion-card"
          >
            {selectedId === leccion.id ? (
              <>
                <h3>{leccion.titulo}</h3>
                <p>{leccion.contenido}</p>
                <button onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}>Cerrar</button>
                {userRole === 'docente' && (
                  <>
                    <button onClick={() => iniciarEdicion(leccion)}>Editar</button>
                    <button onClick={() => handleDeleteLeccion(leccion.id)}>Eliminar</button>
                  </>
                )}
              </>
            ) : (
              <>
                <h3>{leccion.titulo}</h3>
                <p>{leccion.contenido.substring(0, 100)}...</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

    </div>

      <ToastContainer />
    </div>
  );
}

export default Course;
