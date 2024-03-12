import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import 'react-calendar/dist/Calendar.css'; // Estilo por defecto de react-calendar
import '../styles/Calendar.css'; // Estilo personalizado

function CustomCalendar() {
  const [value, onChange] = useState(new Date());
  const [eventDays, setEventDays] = useState([]);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchEventDays = async () => {
      if (currentUser) {
        const q = query(collection(db, "mensajes"), where("alumnoId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const eventos = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return data.timestamp.toDate();
        });
        setEventDays(eventos);
      }
    };

    fetchEventDays();
  }, [currentUser, db]);

  function tileClassName({ date, view }) {
    // Agrega una clase a los días que tienen eventos
    if (view === 'month') {
      // Verifica si la fecha actual está en la lista de eventos
      let isEventDay = eventDays.some(eventDay => {
        return (
          date.getFullYear() === eventDay.getFullYear() &&
          date.getMonth() === eventDay.getMonth() &&
          date.getDate() === eventDay.getDate()
        );
      });

      if (isEventDay) {
        // Retorna una clase si la fecha actual es un día de evento
        return 'event-day';
      }
    }
  }

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
  
}

export default CustomCalendar;

