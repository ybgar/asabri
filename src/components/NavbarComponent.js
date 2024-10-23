// src/components/NavbarComponent.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Gunakan useNavigate untuk navigasi
import styled from 'styled-components';
import logo from '../assets/logo.png';  // Sesuaikan jalur logo jika ada

// Change the background color of StyledNavbar to #002E5E
const StyledNavbar = styled(Navbar)`
  background-color: #002E5E; // Changed navbar color to #002E5E
  padding: 10px 20px;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const UsernameIcon = styled.div`
  color: #5eead4;
  font-size: 24px;
  cursor: pointer;
`;

const NavbarComponent = () => {
  const navigate = useNavigate();

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Hapus currentUser dari localStorage
    navigate('/login'); // Arahkan pengguna kembali ke halaman login
  };

  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">
          <LogoImage src={logo} alt="ASABRI Logo" />
          ASABRI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Hilangkan halaman User */}
          </Nav>
          <Nav>
            {/* Tambahkan tombol Log Out */}
            <Button variant="outline-light" onClick={handleLogout}>
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default NavbarComponent;
