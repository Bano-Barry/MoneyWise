import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Form, Modal, 
  Row, Col, Card, Navbar, Nav, Badge,
  InputGroup, FormControl
} from 'react-bootstrap';
import { 
  FaEdit, FaTrash, FaPlus, FaSignOutAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaBook, FaUserAlt, FaCalendarAlt, FaStar,
  FaSearch, FaMoon, FaSun, FaFilter, FaShareAlt, FaDownload
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';

const BookCRUD = () => {
  // Palette de couleurs
  const colors = {
    primary: '#9c27b0',
    secondary: '#e91e63',
    light: '#f8f1ff',
    dark: '#4a148c',
    accent: '#ff4081'
  };

  // Données initiales avec images fiables
  const defaultBooks = [
    {
      id: '1',
      title: 'Les Misérables',
      author: 'Victor Hugo',
      year: '1862',
      genre: 'Roman historique',
      description: 'Cette épopée romantique suit plusieurs personnages français sur une vingtaine d\'années au XIXe siècle, notamment l\'ancien forçat Jean Valjean qui cherche à se racheter.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 5,
      tags: ['Classique', 'Favoris'],
      pages: 1463,
      downloadUrl: 'https://www.gutenberg.org/ebooks/135'
    },
    {
      id: '2',
      title: 'Madame Bovary',
      author: 'Gustave Flaubert',
      year: '1857',
      genre: 'Roman réaliste',
      description: 'L\'histoire d\'Emma Bovary, épouse d\'un médecin de province, qui tente d\'échapper à l\'ennui de sa vie par des aventures amoureuses.',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4,
      tags: ['Classique'],
      pages: 401,
      downloadUrl: 'https://www.gutenberg.org/ebooks/2413'
    },
    {
      id: '3',
      title: 'Le Rouge et le Noir',
      author: 'Stendhal',
      year: '1830',
      genre: 'Roman psychologique',
      description: 'Julien Sorel, jeune homme ambitieux d\'origine modeste, tente de s\'élever dans la société française post-napoléonienne.',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4,
      tags: ['Classique'],
      pages: 576,
      downloadUrl: 'https://www.gutenberg.org/ebooks/5610'
    },
    {
      id: '4',
      title: 'Les Fleurs du Mal',
      author: 'Charles Baudelaire',
      year: '1857',
      genre: 'Poésie',
      description: 'Recueil poétique majeur qui explore les thèmes de la beauté, la mélancolie, le spleen et l\'idéal.',
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 5,
      tags: ['Poésie', 'Favoris'],
      pages: 320,
      downloadUrl: 'https://www.gutenberg.org/ebooks/6099'
    }
  ];

  // États
  const [books, setBooks] = useState(defaultBooks);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: '',
    image: '',
    tags: [],
    pages: 0,
    downloadUrl: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const navigate = useNavigate();

  // Gestion responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Appliquer le mode sombre
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : colors.light;
    document.body.style.overflowX = 'hidden';
  }, [darkMode, colors.light]);

  // Filtrer les livres
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = filterGenre === '' || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBooks(books.map(book => 
        book.id === editingId ? { ...book, ...formData } : book
      ));
    } else {
      setBooks([...books, { 
        id: Date.now().toString(), 
        ...formData,
        image: formData.image || 'https://via.placeholder.com/300x450?text=No+Cover',
        rating: 0
      }]);
    }
    resetForm();
  };

  // Édition d'un livre
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      description: book.description || '',
      image: book.image,
      tags: book.tags || [],
      pages: book.pages || 0,
      downloadUrl: book.downloadUrl || ''
    });
    setEditingId(book.id);
    setShowModal(true);
  };

  // Mise à jour de la note
  const handleRate = (id, newRating) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, rating: newRating } : book
    ));
  };

  // Suppression d'un livre
  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      year: '',
      genre: '',
      description: '',
      image: '',
      tags: [],
      pages: 0,
      downloadUrl: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Afficher le résumé complet
  const handleShowSummary = (summary) => {
    setCurrentSummary(summary);
    setShowSummaryModal(true);
  };

  // Gestion des erreurs d'image
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x450?text=Couverture+non+disponible';
  };

  // Calcul des statistiques
  const stats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
    genres: [...new Set(books.map(book => book.genre))]
  };

  // Composant StarRating
  const StarRating = ({ rating, onRate }) => (
    <div className="mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar 
          key={star}
          className="me-1"
          style={{ cursor: 'pointer' }}
          color={star <= rating ? '#ffc107' : '#e4e5e9'}
          onClick={() => onRate(star)}
        />
      ))}
    </div>
  );

  return (
    <div className={`d-flex flex-column min-vh-100 ${darkMode ? 'bg-dark text-light' : ''}`}>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: colors.primary }}>
        <Container fluid>
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
              <Button 
                variant="outline-light" 
                onClick={() => setDarkMode(!darkMode)}
                className="me-2 rounded-circle"
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>

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
                <FaSignOutAlt className="me-1" /> Déconnexion
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container fluid className="py-5 flex-grow-1 px-4">
        {/* Barre de recherche et filtres */}
        <div className="mb-4 mx-3">
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Rechercher un livre, auteur ou résumé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-3">
              <Button variant="outline-secondary" className="me-2">
                <FaFilter className="me-1" />
                Filtrer par genre:
              </Button>
              <select 
                className="form-select d-inline-block w-auto"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
              >
                <option value="">Tous les genres</option>
                {stats.genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setShowModal(true)}
              className="rounded-pill fw-bold mb-3"
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.secondary,
                padding: '10px 20px'
              }}
            >
              <FaPlus className="me-2" /> Ajouter un Livre
            </Button>
          </div>
        </div>

        {/* Grille de livres */}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4 mx-3">
          {filteredBooks.map(book => (
            <Col key={book.id}>
              <Card className={`h-100 shadow-sm border-0 overflow-hidden ${darkMode ? 'bg-dark' : ''}`} 
                    style={{ 
                      borderRadius: '15px',
                      transition: 'transform 0.3s',
                      ':hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}>
                <div style={{ 
                  height: '350px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f8f9fa'
                }}>
                  <img 
                    src={book.image}
                    alt={`Couverture de ${book.title}`}
                    style={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                    onError={handleImageError}
                  />
                  <Badge 
                    pill 
                    className="position-absolute top-0 end-0 m-2" 
                    style={{ 
                      backgroundColor: colors.accent,
                      fontSize: '0.8rem'
                    }}
                  >
                    {book.genre}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title 
                    className="mb-3" 
                    style={{ 
                      color: colors.primary,
                      fontWeight: 'bold'
                    }}
                  >
                    {book.title}
                  </Card.Title>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserAlt className="me-2" style={{ color: colors.secondary }} />
                      <span>{book.author}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaCalendarAlt className="me-2" style={{ color: colors.secondary }} />
                      <span>{book.year}</span>
                    </div>
                    {book.pages > 0 && (
                      <div className="d-flex align-items-center mb-2">
                        <FaBook className="me-2" style={{ color: colors.secondary }} />
                        <span>{book.pages} pages</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Résumé du livre */}
                  {book.description && (
                    <div className="mb-3">
                      <Card.Text className={darkMode ? 'text-light' : 'text-muted'}>
                        {book.description.length > 100 
                          ? `${book.description.substring(0, 100)}...` 
                          : book.description}
                      </Card.Text>
                      {book.description.length > 100 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 text-decoration-none"
                          style={{ color: colors.secondary }}
                          onClick={() => handleShowSummary(book.description)}
                        >
                          Lire plus
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Notation par étoiles */}
                  <StarRating 
                    rating={book.rating} 
                    onRate={(newRating) => handleRate(book.id, newRating)} 
                  />
                  
                  {/* Tags */}
                  {book.tags?.length > 0 && (
                    <div className="mb-3">
                      {book.tags.map(tag => (
                        <Badge pill bg="info" className="me-1" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleEdit(book)}
                      className="rounded-pill px-3"
                      style={{ 
                        borderColor: colors.primary,
                        color: colors.primary
                      }}
                    >
                      <FaEdit className="me-1" /> Modifier
                    </Button>
                    <div>
                      {book.downloadUrl && (
                        <Button 
                          variant="outline-success"
                          className="rounded-pill px-3 me-2"
                          href={book.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaDownload className="me-1" />
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger"
                        onClick={() => handleDelete(book.id)}
                        className="rounded-pill px-3"
                      >
                        <FaTrash className="me-1" /> Supprimer
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal d'ajout/modification */}
        <Modal show={showModal} onHide={resetForm} centered size="lg" className={darkMode ? 'dark-modal' : ''}>
          <Modal.Header 
            closeButton 
            className="text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Modal.Title style={{ fontFamily: "'Comic Sans MS', cursive" }}>
              {editingId ? 'Modifier le livre' : 'Ajouter un livre'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} id="bookForm">
              <Row>
                <Col md={6} className="mb-4 mb-md-0">
                  <div 
                    className="d-flex justify-content-center align-items-center border rounded"
                    style={{ 
                      height: '350px',
                      backgroundColor: '#f9f9f9',
                      overflow: 'hidden'
                    }}
                  >
                    {formData.image ? (
                      <img 
                        src={formData.image} 
                        alt="Aperçu de la couverture" 
                        className="img-fluid h-100"
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/300x450?text=Image+non+disponible'
                        }}
                      />
                    ) : (
                      <div className="text-center" style={{ color: colors.primary }}>
                        <FaBook size={60} className="mb-3" />
                        <p>Aperçu de la couverture</p>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mt-3">
                    <Form.Label>URL de l'image</Form.Label>
                    <Form.Control
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Titre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Auteur *</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Année *</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Genre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de pages</Form.Label>
                    <Form.Control
                      type="number"
                      name="pages"
                      value={formData.pages}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Résumé</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Entrez un résumé du livre..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>URL de téléchargement</Form.Label>
                    <Form.Control
                      type="url"
                      name="downloadUrl"
                      value={formData.downloadUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/book.pdf"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Typeahead
                      id="tags"
                      multiple
                      options={['Favoris', 'À lire', 'Classique', 'Prêté', 'Lu']}
                      selected={formData.tags}
                      onChange={(selected) => setFormData({...formData, tags: selected})}
                      placeholder="Ajouter des tags..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              form="bookForm"
              style={{ 
                backgroundColor: colors.secondary,
                borderColor: colors.secondary
              }}
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal pour afficher le résumé complet */}
        <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} centered>
          <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
            <Modal.Title>Résumé complet</Modal.Title>
          </Modal.Header>
          <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
            <p style={{ whiteSpace: 'pre-line' }}>{currentSummary}</p>
          </Modal.Body>
          <Modal.Footer className={darkMode ? 'bg-dark' : ''}>
            <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-auto" style={{ backgroundColor: colors.dark }}>
        <Container fluid>
          <Row className="align-items-center">
            <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
              <h5 style={{ color: colors.accent }} className="mb-2">
                <FaBook className="me-2" />
                GoBooks
              </h5>
              <p className="mb-0 text-white-50">Votre bibliothèque digitale</p>
              <p className="small text-white-50 mt-2">
                {stats.totalBooks} livres • {stats.totalPages} pages
              </p>
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
                <Button variant="link" className="text-white-50 p-0 me-2">
                  Mentions
                </Button>
                <Button variant="link" className="text-white-50 p-0">
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

export default BookCRUD;