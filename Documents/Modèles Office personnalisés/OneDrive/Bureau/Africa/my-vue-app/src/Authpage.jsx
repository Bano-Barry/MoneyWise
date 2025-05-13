import React, { useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "./firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Container, Button, Form, Modal, 
  Row, Col, Card, Navbar, Nav, Badge 
} from "react-bootstrap";
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaBook, FaUserAlt, FaCalendarAlt, FaSignOutAlt, FaEdit, FaTrash, FaPlus
} from "react-icons/fa";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const AuthPage = () => {
  // Palette de couleurs comme dans BookCRUD
  const colors = {
    primary: '#9c27b0',
    secondary: '#e91e63',
    light: '#f8f1ff',
    dark: '#4a148c',
    accent: '#ff4081'
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Créer un document utilisateur dans Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      try {
        await setDoc(userRef, {
          displayName: additionalData.name || user.email.split('@')[0],
          email: user.email,
          photoURL: null,
          points: 0,
          rewards: [],
          challengesCompleted: 0,
          createdAt: new Date().toISOString(),
          ...additionalData
        });

        localStorage.setItem('userData', JSON.stringify({
          name: additionalData.name || user.email.split('@')[0],
          email: user.email,
          photoURL: null,
          points: 0,
          rewards: []
        }));
      } catch (error) {
        console.error("Erreur création document utilisateur:", error);
        throw error; // On propage l'erreur pour la gérer dans handleSignUp
      }
    }
  };

  // Gestion de l'inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await createUserDocument(user, { name });
      
      toast.success(`Bienvenue ${name} ! Inscription réussie.`, {
        onClose: () => {
          // Redirection vers le formulaire de connexion après la notification
          setShowSignUp(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      });
      
    } catch (error) {
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Cet email est déjà utilisé.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Adresse email invalide.";
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Sauvegarder les données utilisateur si nécessaire
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      localStorage.setItem('userData', JSON.stringify({
        name: name || user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null,
        points: userDoc.data()?.points || 0,
        rewards: userDoc.data()?.rewards || []
      }));
      
      toast.success(`Bienvenue ${name || user.email}!`, {
        onClose: () => {
          navigate("/book-crud"); // Redirection vers BookCRUD
        }
      });
      
    } catch (error) {
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Aucun utilisateur trouvé avec cet email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Adresse email invalide.";
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email.");
      return;
    }
  
    // Validation basique de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }
  
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success(`Un email de réinitialisation a été envoyé à ${email}`, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (error) {
      console.error("Erreur reset password:", error);
      
      let errorMessage = "Erreur lors de l'envoi de l'email de réinitialisation";
      switch(error.code) {
        case "auth/user-not-found":
          errorMessage = "Aucun utilisateur trouvé avec cet email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Adresse email invalide";
          break;
        case "auth/too-many-requests":
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.light, width: "100vw", overflowX: "hidden" }}>
      {/* Navbar de BookCRUD */}
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

      {/* Contenu principal */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: isSmallScreen ? "column" : "row",
        backgroundColor: colors.light,
        padding: isSmallScreen ? "20px 0" : "0",
      }}>
        {/* Image pour les petits écrans */}
        {isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "100%",
              height: "40vh",
              objectFit: "cover",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />
        )}

        {/* Formulaire avec la couleur de la navbar */}
        <div style={{
          width: isSmallScreen ? "90%" : "40%",
          maxWidth: "400px",
          padding: "40px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          backgroundColor: colors.primary, // Même couleur que la navbar
          margin: isSmallScreen ? "0 auto" : "0 5%",
          color: 'white' // Texte en blanc pour contraster
        }}>
          {showSignUp ? (
            <form onSubmit={handleSignUp} style={styles.form}>
              <h2 style={{...styles.title, color: 'white'}}>Inscription</h2>
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                required
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{...styles.togglePasswordButton, color: colors.dark}}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                required
                minLength="6"
              />
              <button
                type="submit"
                style={{...styles.button, backgroundColor: colors.secondary}}
                disabled={loading}
              >
                {loading ? "Chargement..." : "S'inscrire"}
              </button>
              <p style={{...styles.toggleText, color: 'white'}} onClick={() => setShowSignUp(false)}>
                Déjà un compte ? Connectez-vous
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} style={styles.form}>
              <h2 style={{...styles.title, color: 'white'}}>Connexion</h2>
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                required
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{...styles.input, backgroundColor: 'rgba(255,255,255,0.9)'}}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{...styles.togglePasswordButton, color: colors.dark}}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                style={{...styles.button, backgroundColor: colors.secondary}}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Se connecter"}
              </button>
              <p style={{...styles.toggleText, color: 'white'}} onClick={() => setShowSignUp(true)}>
                Pas encore de compte ? Inscrivez-vous
              </p>
              <p style={{...styles.resetPassword, color: 'white'}} onClick={handlePasswordReset}>
                Mot de passe oublié ?
              </p>
            </form>
          )}
        </div>

        {/* Image pour les grands écrans */}
        {!isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "50%",
              height: "calc(100vh - 80px)",
              objectFit: "cover",
              borderRadius: "15px 0 0 15px",
            }}
          />
        )}
      </div>

      {/* Footer de BookCRUD */}
      <footer className="py-4 mt-auto" style={{ backgroundColor: colors.dark }}>
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
                <a href="#" style={{ color: colors.accent }}>
                  <FaFacebook size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
                  <FaTwitter size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
                  <FaInstagram size={20} />
                </a>
                <a href="#" style={{ color: colors.accent }}>
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

// Styles
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
    width: "100%",
    ":hover": {
      borderColor: "#9c27b0",
    },
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  togglePasswordButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    position: "absolute",
    right: "10px",
    ":hover": {
      color: "#9c27b0",
    },
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    ":hover": {
      opacity: 0.9,
    },
    ":disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  toggleText: {
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    transition: "color 0.3s ease",
    ":hover": {
      textDecoration: "underline",
    },
  },
  resetPassword: {
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    transition: "color 0.3s ease",
    ":hover": {
      textDecoration: "underline",
    },
  },
};

export default AuthPage;