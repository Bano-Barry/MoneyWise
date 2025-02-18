import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faClock, faMapPin, faPhone,} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Card, } from 'react-bootstrap';



function App() {
  const backgroundStyle = {
      backgroundImage: 'url(/resto.avif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '700px', // Hauteur du background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center'
  };

  const buttonStyle = {
      backgroundColor: "orange",
      color: "white",
      border: "none",
      fontSize: "16px",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "10px"
  };


  const infoSectionStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsive
      gap: "20px",
      padding: "50px 20px",
      textAlign: "center",
      backgroundColor: "#f8f9fa"
  };

  const infoBoxStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
  };

  const iconStyle = {
      fontSize: "40px",
      color: "gold"
  };
 

  const titleUn={
      textAlign:"center",
      fontWeight:"bold"
  };
  const global = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    justifyItems: "center",
    gap: "20px",
    maxWidth: "1200px", 
    margin: "0 auto",
  };
  
  const bloc1 = {
    width: "100%", // Assurer que les cartes prennent toute la place du grid
    display: "flex",
    justifyContent: "center",
  };
  
  const cardStyle = {
    width: "100%",
    maxWidth: "350px",
    boxShadow: "0 2px 2px 2px rgba(0, 0, 0, 0.2)",
    border: "none",
    borderRadius: "15px", // Ajout de coins arrondis
    overflow: "hidden", // Empêche le débordement des images
  };
  
  const imgStyle = {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderTopLeftRadius: "15px", // Arrondi seulement en haut
    borderTopRightRadius: "15px",
  };
  
  const cardBodyStyle = {
    padding: "20px", // Ajoute de l'espace autour du texte
    textAlign: "center", // Centrer le texte
  };
  
  const headingStyle = {
    fontSize: '4.5em',
    color: "white",
    marginBottom: "10px", // Réduit l'espace avec le texte en dessous
  };
  
  const paragraphStyle = {
    fontSize: '2.5em',
    color: "white",
    marginTop: "0px", // Supprime l'espace trop grand en haut
  };
  
  
  

  
  return (
      <div>
          {/* Section avec l'image de fond */}
          <div style={backgroundStyle}>
              <h1 style={headingStyle}>La Belle Cuisine</h1>
              <p style={paragraphStyle}>Une expérience gastronomique exceptionnelle</p>
              <button style={buttonStyle} size="lg" active>
                  Réserver une table
              </button>
          </div><br/><br/>

          {/* Section des informations (hors background) */}
          <div style={infoSectionStyle}>
              <div style={infoBoxStyle}>
                  <FontAwesomeIcon icon={faUtensils} style={iconStyle} />
                  <h3>Chef Étoilé</h3>
                  <p>Cuisine raffinée par notre chef renommé</p>
              </div>
              <div style={infoBoxStyle}>
                  <FontAwesomeIcon icon={faClock} style={iconStyle} />
                  <h3>Horaires</h3>
                  <p>Ouvert du Mardi au Dimanche</p>
              </div>
              <div style={infoBoxStyle}>
                  <FontAwesomeIcon icon={faMapPin} style={iconStyle} />
                  <h3>Emplacement</h3>
                  <p>Au cœur de la ville</p>
              </div>
          </div><br/><br/><br/>
          <div>
              <div style={titleUn}>
                  <h1>Nos specialités</h1>
              </div><br/><br/>
              <div style={global}>
  <div style={bloc1}>
    <Card style={cardStyle}>
      <Card.Img variant="top" src="un.avif" style={imgStyle} />
      <Card.Body style={cardBodyStyle}>
        <Card.Title>Filet mignon</Card.Title>
        <Card.Text>Saumon frais, épinards, sauce hollandaise</Card.Text>
      </Card.Body>
    </Card>
  </div>

  <div style={bloc1}>
    <Card style={cardStyle}>
      <Card.Img variant="top" src="img2.webp" style={imgStyle} />
      <Card.Body style={cardBodyStyle}>
        <Card.Title>Saumon en croûte</Card.Title>
        <Card.Text>Création unique quotidienne</Card.Text>
      </Card.Body>
    </Card>
  </div>

  <div style={bloc1}>
    <Card style={cardStyle}>
      <Card.Img variant="top" src="trois.avif" style={imgStyle} />
      <Card.Body style={cardBodyStyle}>
        <Card.Title>Dessert du Chef</Card.Title>
        <Card.Text>Création unique quotidienne</Card.Text>
      </Card.Body>
    </Card>
  </div>
</div>

      </div><br/><br/><br/><br/><br/><br/>
    { /*footer*/}
    <div className="footer-container">
          <div className="contact">
              <h1>Contactez-nous</h1>
              <p><FontAwesomeIcon icon={faPhone} className="icon" /> +33 1 23 45 67 89</p>
              <p><FontAwesomeIcon icon={faMapPin} className="icon" /> 123 Rue de la Gastronomie, Paris</p>
              <div className="social-icons">
                  <FontAwesomeIcon icon={faFacebookF} className="icon" />
                  <FontAwesomeIcon icon={faTwitter} className="icon" />
                  <FontAwesomeIcon icon={faInstagram} className="icon" />
              </div>
          </div>
          <div className="horaires">
              <h1>Horaires d'ouverture</h1>
              <p>Mardi - Jeudi : 12h00 - 22h30</p>
              <p>Vendredi - Samedi : 12h00 - 23h30</p>
              <p>Dimanche : 12h00 - 22h00</p>
              <p>Lundi : Fermé</p>
          </div>
      </div>
      </div>
  );
}

export default App;
