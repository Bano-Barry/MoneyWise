import React, { useState, useEffect } from 'react';
import {
  Container, Button, Row, Col,
  Navbar, Nav, Card
} from 'react-bootstrap';
import {
  FaBook, FaSignInAlt, FaArrowRight,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaSearch, FaHeart, FaListAlt, FaSignOutAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  // Palette de couleurs
  const colors = {
    primary: '#9c27b0',
    secondary: '#e91e63',
    light: '#f8f1ff',
    dark: '#4a148c',
    accent: '#ff4081'
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Livres populaires (exemple)
  const popularBooks = [
    {
      id: 1,
      title: "L'Alchimiste",
      author: "Paulo Coelho",
      image: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 3,
      title: "Harry Potter",
      author: "J.K. Rowling",
      image: "https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg"
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100" style={{
      backgroundColor: colors.light,
      width: "100vw",
      overflowX: "hidden"
    }}>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: colors.primary }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white" style={{
            fontSize: isSmallScreen ? "1.8rem" : "2.5rem",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            fontWeight: 'bold'
          }}>
            <FaBook className="me-2" />
            GoBooks
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-white" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link 
                as={Link} 
                to="/" 
                className="text-white mx-2 fw-medium"
                style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
              >
                Accueil
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/book-crud" 
                className="text-white mx-2 fw-medium"
                style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
              >
                Bibliothèque
              </Nav.Link>

              <Button 
                variant="outline-light" 
                onClick={() => navigate('/auth')}
                className="ms-lg-3 rounded-pill"
                style={{ 
                  borderWidth: '2px',
                  fontWeight: '600'
                }}
              >
                <FaSignOutAlt className="me-1" /> Connexion
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section - Version modifiée sans filtre mauve */}
      <div className="position-relative" style={{
        height: isSmallScreen ? '60vh' : '80vh',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        <img
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
          alt="Bibliothèque"
          className="w-100 h-100 object-fit-cover"
          style={{
            objectPosition: 'center'
          }}
        />

        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3" style={{
          zIndex: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)' // Amélioration de la lisibilité
        }}>
          <h1 className="text-white mb-4" style={{
            fontSize: isSmallScreen ? '2.5rem' : '4rem',
            fontWeight: 'bold',
            fontFamily: "'Comic Sans MS', cursive, sans-serif"
          }}>
            Votre bibliothèque digitale
          </h1>
          <p className="text-white mb-5" style={{
            fontSize: isSmallScreen ? '1.2rem' : '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Découvrez, organisez et partagez vos livres préférés
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="rounded-pill px-4 py-3"
            style={{
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
              fontSize: '1.2rem',
              fontWeight: '600'
            }}
          >
            Commencer maintenant <FaArrowRight className="ms-2" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <Container className="my-5">
        <h2 className="text-center mb-5" style={{ 
          color: colors.dark,
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          fontWeight: 'bold'
        }}>
          Pourquoi choisir GoBooks ?
        </h2>

        <Row className="g-4">
          {[
            {
              title: 'Recherche facile',
              description: 'Trouvez rapidement les livres que vous cherchez',
              icon: <FaSearch size={40} className="mb-3" style={{ color: colors.primary }} />
            },
            {
              title: 'Collection personnelle',
              description: 'Créez votre propre bibliothèque virtuelle',
              icon: <FaHeart size={40} className="mb-3" style={{ color: colors.primary }} />
            },
            {
              title: 'Organisation',
              description: 'Classez vos livres par catégories et genres',
              icon: <FaListAlt size={40} className="mb-3" style={{ color: colors.primary }} />
            }
          ].map((feature, index) => (
            <Col key={index} md={4}>
              <Card className="h-100 border-0 shadow-sm" style={{ 
                borderRadius: '15px',
                backgroundColor: 'white'
              }}>
                <Card.Body className="text-center p-4">
                  {feature.icon}
                  <Card.Title style={{ 
                    color: colors.dark,
                    marginBottom: '15px',
                    fontFamily: "'Comic Sans MS', cursive, sans-serif"
                  }}>
                    {feature.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#555' }}>
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Popular Books Section */}
      <Container className="my-5">
        <h2 className="text-center mb-5" style={{ 
          color: colors.dark,
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          fontWeight: 'bold'
        }}>
          Livres populaires
        </h2>

        <Row className="g-4 justify-content-center">
          {popularBooks.map((book) => (
            <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s',
                cursor: 'pointer',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Card.Img 
                  variant="top" 
                  src={book.image} 
                  style={{ 
                    height: '300px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }} 
                />
                <Card.Body>
                  <Card.Title style={{ color: colors.primary }}>
                    {book.title}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    {book.author}
                  </Card.Text>
                  <Button variant="outline-primary" className="w-100 mt-3 rounded-pill">
                    Voir plus
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-auto" style={{ 
        backgroundColor: colors.dark,
        width: '100%'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
              <h5 style={{ color: colors.accent }} className="mb-2">
                <FaBook className="me-2" />
                GoBooks
              </h5>
              <p className="mb-0 text-white-50">Votre bibliothèque digitale</p>
            </Col>
            
            <Col md={4} className="text-center mb-3 mb-md-0">
              <div className="d-flex justify-content-center gap-3">
                <a href="#facebook" style={{ color: colors.accent }}>
                  <FaFacebook size={20} />
                </a>
                <a href="#twitter" style={{ color: colors.accent }}>
                  <FaTwitter size={20} />
                </a>
                <a href="#instagram" style={{ color: colors.accent }}>
                  <FaInstagram size={20} />
                </a>
                <a href="#linkedin" style={{ color: colors.accent }}>
                  <FaLinkedin size={20} />
                </a>
              </div>
            </Col>
            
            <Col md={4} className="text-center text-md-end">
              <p className="mb-1 text-white-50">
                © {new Date().getFullYear()} GoBooks
              </p>
              <div>
                <Button 
                  variant="link" 
                  className="text-white-50 p-0 me-2"
                  onClick={() => console.log('Mentions')}
                >
                  Mentions
                </Button>
                <Button 
                  variant="link" 
                  className="text-white-50 p-0"
                  onClick={() => console.log('Confidentialité')}
                >
                  Confidentialité
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;