// src/components/LoginPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom'; // Import Link dari react-router-dom
// src/components/LoginPage.js
import logo from '../assets/logo.png'; // Sesuaikan jalur file logo

// Styled component for the page wrapper
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height of the screen */
  background-color: #f0f0f0; /* Background for contrast */
`;

// Styled component for the container
const Container = styled.div`
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #333;
  display: flex;
  flex-direction: column; /* Arrange content vertically */
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #002966;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #001b4c; // Changed hover color
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const LinkContainer = styled.div`
  margin-top: 20px;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Gunakan useNavigate

  const handleLogin = (event) => {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('currentUser', username); // Simpan username ke localStorage

      // Tambahkan data login ke tabel di halaman HomePage
      const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
      const loginData = {
        bulanBayar: 'N/A',
        status: 'Login',
        pengguna: username,
        tanggalPembuatan: new Date().toISOString().split('T')[0],
        penggunaPembatalan: '',
        tanggalPembatalan: ''
      };
      tableData.push(loginData); // Tambahkan data login
      localStorage.setItem('tableData', JSON.stringify(tableData)); // Simpan data tabel

      alert('Login sukses!');
      navigate('/home');
    } else {
      setError('ID Admin atau Password salah!');
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Logo src={logo} alt="ASABRI Logo" />
        <Title>Administrasi Aplikasi Pensiun</Title>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="User name"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Simpan input username
          />
          <Input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Simpan input password
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login</Button>
        </form>
        <LinkContainer>
          <Link to="/register">Belum punya akun? Daftar di sini</Link> {/* Link ke halaman register */}
        </LinkContainer>
      </Container>
    </PageWrapper>
  );
};

export default LoginPage;
