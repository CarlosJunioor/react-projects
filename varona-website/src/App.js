import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="about" element={ <About /> } />
        <Route path="team" element={ <Team /> } />
      </Routes>
    </Router>
  );
}

export default App;