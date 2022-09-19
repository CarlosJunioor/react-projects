import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
        <Route path="/" element={ <Home /> }>
        <Route path="about" element={ <About /> }
          
        </Route>
      
    </Router>
  );
}

export default App;