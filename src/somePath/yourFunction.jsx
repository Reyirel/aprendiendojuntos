// En el archivo userUtils.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Asegúrate de que la ruta a tu configuración de Firebase es correcta

export async function getUserRole(userId) {
  const userRef = doc(db, 'usuarios', userId); // Asume que tus usuarios están en una colección llamada 'usuarios'
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    return userData.rol; // Asume que cada usuario tiene un campo 'rol' en su documento
  } else {
    console.log("No se encontró el documento del usuario.");
    return null; // O manejar de otra manera
  }
}
