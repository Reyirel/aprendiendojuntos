import React, { useState } from 'react';

function Messages() {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: messagesList.length + 1,
      text: message,
      // Aquí podrías añadir más información como el remitente, fecha, etc.
    };
    setMessagesList([...messagesList, newMessage]);
    setMessage('');
  };

  return (
    <div className="messages-section">
      <h2>Enviar Mensaje</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Escribe tu mensaje aquí..."
          required
        />
        <button type="submit">Enviar</button>
      </form>

      <h3>Mensajes Enviados</h3>
      <ul>
        {messagesList.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
          // Aquí puedes expandir cada mensaje para incluir más detalles
        ))}
      </ul>
    </div>
  );
}

export default Messages;
