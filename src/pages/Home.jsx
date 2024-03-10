import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Home.css';
import Card from '../components/Card';

import img1 from '../images/pexels-eberhard-grossgasteiger-1292115.jpg';
import img2 from '../images/pexels-lumn-167699.jpg';
import img3 from '../images/pexels-stephane-hurbe-4198029.jpg';

function Home() {
  const { currentUser } = useAuth();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursosInscritos = async () => {
      if (currentUser) {
        const cursosRef = collection(db, "cursos");
        const q = query(cursosRef, where("estudiantes", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const cursosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCursos(cursosData);
      }
    };

    fetchCursosInscritos();
  }, [currentUser]);

  const handleUnsubscribeFromCurso = async (cursoId) => {
    try {
      const cursoRef = doc(db, "cursos", cursoId);
      const cursoSnap = await getDoc(cursoRef);

      if (cursoSnap.exists()) {
        let estudiantes = cursoSnap.data().estudiantes;
        estudiantes = estudiantes.filter(uid => uid !== currentUser.uid);
        await updateDoc(cursoRef, {
          estudiantes: estudiantes
        });
        setCursos(cursos.filter(curso => curso.id !== cursoId));
        toast.success("Te has desinscrito del curso con éxito", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error al desinscribir del curso:", error);
      toast.error("Error al desinscribir del curso", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="home-page">
      <ToastContainer />
      <div className="titulo">
        <h1>Bienvenido a Nuestra Plataforma de Aprendizaje</h1>
      </div>

      <div className="carrusel">
        <Slider {...settings}>
          <div>
            <img src={img1} alt="Imagen 1" />
          </div>
          <div>
            <img src={img2} alt="Imagen 2" />
          </div>
          <div>
            <img src={img3} alt="Imagen 3" />
          </div>
        </Slider>
      </div>

      <section className='cursos'>
        <h2>Tus cursos</h2>
        <div className="tarjetas">
          {cursos.map(curso => (
            <Card 
              key={curso.id} 
              curso={curso} 
              showActionButton={true}
              actionButtonText="Desinscribir"
              onActionButtonClick={() => handleUnsubscribeFromCurso(curso.id)}
              showCourseLink={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
