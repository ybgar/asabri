import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const TableComponent = () => {
  const [data, setData] = useState([]); // State for storing table data
  const [selectedRow, setSelectedRow] = useState(null); // State for storing selected row
  const [loading, setLoading] = useState(false); // State for loading
  const [isProcessed, setIsProcessed] = useState(false); // State to track if data has been processed
  const [searchQuery, setSearchQuery] = useState(''); // State for storing search input
  const [page, setPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const limit = 20; // Number of data per page

  const navigate = useNavigate();

  // Kolom tabel
  const columns = [
    "NRP_NIP", 
    "NOPENS", 
    "BLNBYR", 
    "NIK", 
    "PENS_POKOK", 
    "Kode Jiwa",  
    "PPH 21 TER", 
    "NAMA_KEP"
  ];

  // Fungsi untuk menangani klik pada baris tabel
  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  // Fungsi untuk mengambil data dari backend berdasarkan halaman dan parameter unik
  const fetchData = async (uniqueParam, currentPage = 1) => {
    setLoading(true);
    const url = `https://vercel.com/api/toolbar/link/asabri.vercel.app?via=project-dashboard-alias-list&p=1&page=${currentPage}&limit=${limit}&uniqueParam=${uniqueParam}`;

    try {
      const response = await axios.get(url);
      console.log('Data yang diterima:', response.data.recordset);
      setData(response.data.recordset || []);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetchData ketika `isProcessed` berubah menjadi true
  useEffect(() => {
    if (isProcessed) {
      const uniqueParam = new Date().getTime(); // Generate a unique ID based on the current timestamp
      fetchData(uniqueParam, page);
    }
  }, [isProcessed, page]);

  // Function to move selected data to localStorage and remove from TableComponent
  const handleCancel = () => {
    if (selectedRow) {
      // Get history data from localStorage, or create a new array if it doesn't exist
      const riwayatData = JSON.parse(localStorage.getItem('riwayatData')) || [];

      // Add the selected data to riwayatData
      riwayatData.push(selectedRow);
      localStorage.setItem('riwayatData', JSON.stringify(riwayatData));

      // Remove the selected data from table data
      const updatedData = data.filter(item => item !== selectedRow);
      setData(updatedData);

      // Reset selectedRow
      setSelectedRow(null);

      // Inform that data has been moved to history
      alert('Data dipindahkan ke Riwayat');
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      const uniqueParam = new Date().getTime();
      const response = await axios.post('https://vercel.com/api/toolbar/link/asabri.vercel.app?via=project-dashboard-alias-list&p=1&page=/', { uniqueParam });

      // Pastikan data yang diterima dari response disimpan ke localStorage
      const dataToSave = response.data.recordset;
      if (dataToSave) {
        // Simpan data ke localStorage pada key `reportingData`
        localStorage.setItem('reportingData', JSON.stringify(dataToSave));
        alert('Proses berhasil dijalankan dan data disimpan ke localStorage!');

        // Memindahkan data yang disimpan ke `reportingData` agar bisa diakses oleh ReportingPage
        const existingData = JSON.parse(localStorage.getItem('reportingData')) || [];
        const updatedData = [...existingData, ...dataToSave]; // Combine existing and new data
        localStorage.setItem('reportingData', JSON.stringify(updatedData)); // Simpan data baru ke reportingData
      } else {
        console.warn('No data to save in localStorage');
      }
      setIsProcessed(true);
    } catch (error) {
      console.error('Gagal menjalankan proses:', error);
      alert('Proses gagal dijalankan.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor."); // Alert if no data to export
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data"); // Append worksheet to workbook

    XLSX.writeFile(workbook, "data_export.csv"); // Save the file as CSV
  };

  // Filter data based on search query
  const filteredData = data.filter(row => {
    return (
      row.NRP_NIP.toLowerCase().includes(searchQuery) ||
      row.NOPENS.toLowerCase().includes(searchQuery) ||
      row.NIK.toLowerCase().includes(searchQuery) ||
      (row.NAMA_KEP && row.NAMA_KEP.toLowerCase().includes(searchQuery)) // Filter based on NAMA_KEP
    );
  });

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="container mt-5">
      <div className="mb-3 d-flex justify-content-start">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>&larr; Back</button>
      </div>

      <div className="mb-3">
        <input 
          type="text" 
          className="form-control w-25" 
          placeholder="Cari NRP/NIP, NOPENS, NIK..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} 
        />
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleProcess}>Proses</button>
        <button className="btn btn-danger me-2" onClick={handleCancel}>Batal</button> {/* Call handleCancel */}
        <button className="btn btn-info" onClick={exportToCSV}>Convert to CSV</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">Loading...</td>
            </tr>
          ) : !isProcessed ? (
            <tr>
              <td colSpan={columns.length} className="text-center">Belum ada data. Klik "Proses" untuk memulai perhitungan.</td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">No data found</td>
            </tr>
          ) : (
            filteredData.map((row, index) => (
              <tr 
                key={index}
                className={selectedRow?.NRP_NIP === row.NRP_NIP ? 'table-primary' : ''} 
                onClick={() => handleRowClick(row)} 
                style={{ cursor: 'pointer' }}
              >
                <td>{row.NRP_NIP}</td>
                <td>{row.NOPENS}</td>
                <td>{row.BLNBYR}</td>
                <td>{row.NIK}</td>
                <td>{row.PENS_POKOK}</td>
                <td>{row.KODE_JIWA}</td>
                <td>{row.POT_PPH21}</td>
                <td>{row.NAMA_KEP}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Kontrol Pagination */}
      {isProcessed && ( // Hanya tampilkan pagination jika data sudah diproses
        <div className="d-flex justify-content-between mt-3">
          <button 
            className="btn btn-secondary" 
            onClick={handlePreviousPage} 
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            onClick={handleNextPage} 
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
