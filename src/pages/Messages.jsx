import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../styles/Messages.css';

function Messages() {
  const [mensajes, setMensajes] = useState([]);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchMensajes = async () => {
      if (currentUser) {
        const q = query(collection(db, "mensajes"), where("alumnoId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const mensajesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const mensajesConDatosAdicionales = await Promise.all(mensajesData.map(async mensaje => {
          // Obtener el nombre del usuario que envió el mensaje
          const enviadoPorRef = doc(db, "usuarios", mensaje.enviadoPor);
          const enviadoPorSnap = await getDoc(enviadoPorRef);
          const enviadoPorData = enviadoPorSnap.data();
          mensaje.enviadoPorNombre = `${enviadoPorData.nombre} ${enviadoPorData.apellidos}`;

          // Obtener el nombre del curso
          const cursoRef = doc(db, "cursos", mensaje.cursoId);
          const cursoSnap = await getDoc(cursoRef);
          const cursoData = cursoSnap.data();
          mensaje.cursoNombre = cursoData.nombre;

          // Obtener el título de la lección
          if (mensaje.leccionId) { // Asegúrate de que haya un leccionId antes de intentar buscarlo
            const leccionRef = doc(db, "lecciones", mensaje.leccionId);
            const leccionSnap = await getDoc(leccionRef);
            const leccionData = leccionSnap.data();
            mensaje.leccionTitulo = leccionData.titulo;
          } else {
            mensaje.leccionTitulo = "N/A"; // O algún valor predeterminado si no hay lección
          }

          return mensaje;
        }));

        setMensajes(mensajesConDatosAdicionales);
      }
    };

    fetchMensajes();
  }, [currentUser, db]);

  return (
    <div>
      <h1>Mis Mensajes</h1>
      <div className="lista-mensajes">
        {mensajes.length > 0 ? (
          mensajes.map(mensaje => (
            <div key={mensaje.id} className="tarjeta-mensaje">
              <h3>Curso: {mensaje.cursoNombre}</h3>
              <p>Lección: {mensaje.leccionTitulo}</p>
              <p>De: {mensaje.enviadoPorNombre}</p>
              <p>Mensaje: {mensaje.mensaje}</p>
              <p>Fecha: {mensaje.timestamp.toDate().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
            </div>
          ))
        ) : (
          <p>No tienes mensajes.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
