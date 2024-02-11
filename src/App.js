import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Recommend from './components/Recommend';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/recommend" element={<Recommend/>} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
