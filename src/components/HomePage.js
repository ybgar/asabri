import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Table, Form, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BiCheckCircle } from 'react-icons/bi'; // Import check circle icon from react-icons
import styled from 'styled-components';
import logo from '../assets/logo.png';

// Styled components for custom styling
// Change background-color of StyledNavbar to #002E5E
const StyledNavbar = styled(Navbar)`
  background-color: #002E5E; // Changed navbar color to #002E5E
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

// Styled component for table header color
const StyledTableHeader = styled.th`
  background-color: #002E5E; // Change header background color
  color: #FFFFFF; // Change text color to white
  text-align: center;
  vertical-align: middle;
`;

// Styled component for thead color
const StyledThead = styled.thead`
  background-color: #002E5E; // Change thead background color to #002E5E
  color: #FFFFFF; // Change text color to white;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const StyledTable = styled(Table)`
  margin: 20px;
  background-color: #002E5E;
`;

const SelectColumn = styled.th`
  width: 50px; /* Width of the selection column */
`;

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [reason, setReason] = useState(''); // State for cancellation reason
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('currentUser');
    setUsername(storedUsername);

    // Retrieve table data from localStorage
    const storedTableData = JSON.parse(localStorage.getItem('tableData')) || [];
    setTableData(storedTableData);
  }, []);

  // Function to process selected items
  const handleProcess = () => {
    const updatedData = tableData.map((item, index) =>
      selectedData.includes(index)
        ? { ...item, status: 'Berhasil', bulanBayar: '202409' } // Set Bulan Bayar to '202409'
        : item
    );

    setTableData(updatedData);
    localStorage.setItem('tableData', JSON.stringify(updatedData));
    setSelectedData([]); // Reset selection
    alert('Proses berhasil!');
  };

  // Function to cancel selected items
  const handleCancel = () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const currentUser = localStorage.getItem('currentUser'); // Current logged-in user

    const updatedData = tableData.map((item, index) =>
      selectedData.includes(index)
        ? {
            ...item,
            status: 'Batal',
            penggunaPembatalan: currentUser,
            tanggalPembatalan: currentDate,
          }
        : item
    );

    setTableData(updatedData);
    localStorage.setItem('tableData', JSON.stringify(updatedData));
    setSelectedData([]); // Reset selection
    alert('Pembatalan berhasil!');
  };

  // Show delete confirmation modal
  const handleDelete = () => {
    if (selectedData.length === 0) {
      alert('Pilih data yang ingin dihapus.');
      return;
    }

    setShowDeleteModal(true); // Show delete confirmation modal
  };

  // Function to process deletion confirmation
  const confirmDelete = () => {
    // Remove selected data from state and localStorage
    const newData = tableData.filter((_, index) => !selectedData.includes(index));
    setTableData(newData);
    setSelectedData([]);
    localStorage.setItem('tableData', JSON.stringify(newData)); // Update localStorage with the latest data

    // Reset state and show success modal
    setReason(''); // Reset cancellation reason
    setShowDeleteModal(false); // Close delete confirmation modal
    setShowSuccessModal(true); // Show success modal
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Close success modal
  };

  // Change selection status of checkboxes
  const handleSelectChange = (index) => {
    const updatedSelectedData = [...selectedData];
    if (updatedSelectedData.includes(index)) {
      const filteredData = updatedSelectedData.filter(item => item !== index);
      setSelectedData(filteredData);
    } else {
      updatedSelectedData.push(index);
      setSelectedData(updatedSelectedData);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Remove user data from localStorage
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      {/* Navbar */}
      <StyledNavbar expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <LogoImage src={logo} alt="ASABRI Logo" />
            <span className="text-white">ASABRI</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown title={<span className="text-white"><i className="bi bi-list"></i> AP3</span>} id="ap3-nav-dropdown" className="text-white">
              <NavDropdown.Item as={Link} to="/detail">Detail</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/riwayat">Riwayat</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Reporting">Reporting</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Log Out
            </Button>
          </Nav>
        </Container>
      </StyledNavbar>

      {/* Main Page Content */}
      <Container fluid>
        <h4 className="mt-4">Daftar Proses Bulanan</h4>

        {/* Process and Cancel Buttons */}
        <div className="mb-3">
          <Button variant="success" className="me-2" onClick={handleProcess}>
            Proses
          </Button>
          <Button variant="danger" className="me-2" onClick={handleCancel} disabled={selectedData.length === 0}>
            Pembatalan
          </Button>
        </div>

        {/* Table */}
        <StyledTable striped bordered hover responsive>
          <StyledThead>
            <tr>
              <SelectColumn>Select</SelectColumn>
              <StyledTableHeader rowSpan={2}>Bulan Bayar</StyledTableHeader>
              <StyledTableHeader rowSpan={2}>Status</StyledTableHeader>
              <StyledTableHeader colSpan={2} className="text-center">Pembuatan</StyledTableHeader>
              <StyledTableHeader colSpan={2} className="text-center">Pembatalan</StyledTableHeader>
            </tr>
            <tr>
              <StyledTableHeader>Pengguna</StyledTableHeader>
              <StyledTableHeader>Tanggal</StyledTableHeader>
              <StyledTableHeader>Pengguna</StyledTableHeader>
              <StyledTableHeader>Tanggal</StyledTableHeader>
            </tr>
          </StyledThead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td style={{ width: '50px' }}>
                  <Form.Check 
                    type="checkbox"
                    checked={selectedData.includes(index)}
                    onChange={() => handleSelectChange(index)}
                  />
                </td>
                <td>{item.bulanBayar || '20249'}</td> {/* Display Bulan Bayar */}
                <td>{item.status || '-'}</td> {/* Display Status */}
                <td>{item.pengguna || '-'}</td>
                <td>{item.tanggalPembuatan || '-'}</td>
                <td>{item.penggunaPembatalan || '-'}</td>
                <td>{item.tanggalPembatalan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Pembatalan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <BiCheckCircle style={{ fontSize: '48px', color: 'green' }} /> {/* Check circle icon */}
              <p>Batalkan proses {tableData[selectedData[0]]?.bulanBayar || 'proses ini'}?</p>
              <Form.Group>
                <Form.Label>Isi Catatan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Isi Alasan"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={confirmDelete} disabled={!reason}>
              Ya
            </Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Tidak
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={closeSuccessModal} centered>
          <Modal.Body className="text-center">
            <BiCheckCircle style={{ fontSize: '48px', color: 'green' }} /> {/* Check circle icon */}
            <h5>Pembatalan berhasil</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeSuccessModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default HomePage;
