import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../styles/Messages.css'; // Asegúrate de que el path a tu archivo CSS sea correcto

function Messages() {
  const [mensajes, setMensajes] = useState([]);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchMensajes = async () => {
      if (currentUser) {
        const q = query(collection(db, "mensajes"), where("alumnoId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        setMensajes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
              <h3>Curso: {mensaje.cursoId}</h3>
              <p>Lección: {mensaje.leccionId}</p>
              <p>De: {mensaje.instructorId}</p>
              <p>Mensaje: {mensaje.mensaje}</p>
              <p>Fecha: {mensaje.timestamp.toDate().toDateString()}</p>
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
