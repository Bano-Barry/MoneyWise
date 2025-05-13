import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages principales
import HomePage from "./HomePage";
import AuthPage from "./Authpage";
import BookCRUD from './BookCRUD';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/book-crud" element={<BookCRUD />} />
      </Routes>
    </Router>
  );
}

export default App;
