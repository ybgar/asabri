// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import TableComponent from './components/TableComponent';  // Sesuaikan jalur impor
import RiwayatPage from './components/RiwayatPage';  // Sesuaikan jalur impor
import RegisterPage from './components/RegisterPage';
import ReportingPage from './components/ReportingPage';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/detail" element={<TableComponent />} /> {/* Halaman Detail */}
        <Route path="/riwayat" element={<RiwayatPage />} /> {/* Halaman Riwayat */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/reporting" element={<ReportingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
