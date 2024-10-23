// src/components/RegisterPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #333;
  margin-top: 20px;
  margin-left: 20px;
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
    background-color: #001b4c;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  const handleRegister = (event) => {
    event.preventDefault();

    // Validasi sederhana untuk memastikan password sama
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak sama!');
      return;
    }

    // Simpan pengguna baru ke localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserExist = users.find((user) => user.username === username);

    if (isUserExist) {
      setError('Username sudah terdaftar!');
      return;
    }

    // Tambahkan pengguna baru ke localStorage
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Simpan username ke localStorage agar bisa digunakan di HomePage
    localStorage.setItem('currentUser', username); // Simpan username saat pendaftaran

    // Tambahkan data ke tabel di halaman HomePage
    const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    const newUser = {
      bulanBayar: 'N/A',  // Isi data yang sesuai
      status: 'Terdaftar',
      pengguna: username,
      tanggalPembuatan: new Date().toISOString().split('T')[0],  // Format tanggal
      penggunaPembatalan: '',
      tanggalPembatalan: ''
    };
    tableData.push(newUser);
    localStorage.setItem('tableData', JSON.stringify(tableData)); // Simpan data tabel

    alert('Pendaftaran berhasil! Silakan login.');
    navigate('/home'); // Arahkan langsung ke halaman Home
  };

  return (
    <Container>
      <Title>Register</Title>
      <form onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Simpan input username
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Simpan input password
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Simpan input konfirmasi password
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Register</Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
