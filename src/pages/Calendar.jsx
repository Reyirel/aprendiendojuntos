import React, { useState } from 'react';
import Calendar from 'react-calendar';


function MyCalendar() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar onChange={onChange} value={date} />
      <p>Fecha seleccionada: {date.toDateString()}</p>
    </div>
  );
}

export default MyCalendar;
