import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReportingPage.css';
import * as XLSX from 'xlsx';

const ReportingPage = () => {
  const [data, setData] = useState([]); // State untuk menyimpan data dari API
  const [selectedRow, setSelectedRow] = useState(null); // State untuk baris yang dipilih
  const [loading, setLoading] = useState(false); // State untuk indikator loading
  const [isProcessed, setIsProcessed] = useState(false); // State untuk melacak apakah data sudah diproses
  const [searchQuery, setSearchQuery] = useState(''); // State untuk menyimpan input pencarian
  const [page, setPage] = useState(1); // State untuk halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // State untuk total halaman
  const [gridView, setGridView] = useState(false); // State untuk mengatur tampilan grid
  const limit = 20; // Jumlah data per halaman
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi
  const offset = (page - 1) * limit; // Hitung offset di awal

  // Kolom tabel yang akan dirender
  const columns = [
    "JNSBYR",
    "NRP_NIP", 
    "NOPENS", 
    "PENS_POKOK", 
    "TUNJ_ISTRI", 
    "TUNJ_BERAS", 
    "KODE_JIWA", 
    "JML_BRUTO_SBLM_PJK", 
    "NIK", 
    "NAMA_KEP", 
    "NAMA_DUKCAPIL"
  ];

  // Fungsi untuk mengambil data dari backend berdasarkan halaman dan parameter unik
  const fetchData = async (uniqueParam, currentPage = 1) => {
    setLoading(true);
    const url = `https://vercel.com/api/toolbar/link/asabri.vercel.app?via=project-dashboard-alias-list&p=1&page=${currentPage}&limit=${limit}&offset=${offset}&uniqueParam=${uniqueParam}`;

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

  // Fungsi untuk menjalankan proses perhitungan dan menyimpan data ke localStorage
  const handleProcess = async () => {
    setLoading(true);
    try {
      const uniqueParam = new Date().getTime();
      const response = await axios.post('http://localhost:5000/api/execute-tax-calculation', { uniqueParam });

      // Pastikan data yang diterima dari response disimpan ke localStorage
      const dataToSave = response.data.recordset;
      if (dataToSave) {
        localStorage.setItem('reportingData', JSON.stringify(dataToSave)); // Simpan data ke localStorage
        alert('Proses berhasil dijalankan dan data disimpan ke localStorage!');

        const existingData = JSON.parse(localStorage.getItem('reportingData')) || [];
        const updatedData = [...existingData, ...dataToSave]; // Gabungkan data baru dengan data lama
        localStorage.setItem('reportingData', JSON.stringify(updatedData)); // Simpan data baru ke reportingData
      } else {
        console.warn('No data to save in localStorage');
      }
      setIsProcessed(true);
      setGridView(true); // Tampilkan grid setelah proses selesai
    } catch (error) {
      console.error('Gagal menjalankan proses:', error);
      alert('Proses gagal dijalankan.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memindahkan data yang dipilih ke riwayat (dari TableComponent)
  const handleCancel = () => {
    if (selectedRow) {
      const riwayatData = JSON.parse(localStorage.getItem('riwayatData')) || [];
      riwayatData.push(selectedRow);
      localStorage.setItem('riwayatData', JSON.stringify(riwayatData));

      const updatedData = data.filter(item => item !== selectedRow);
      setData(updatedData);
      setSelectedRow(null);

      alert('Data dipindahkan ke Riwayat');
    }
  };

  // Fungsi untuk ekspor ke CSV
  const exportToCSV = () => {
    if (data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, "DataReporting.csv");
    }
  };

  // Panggil fetchData ketika isProcessed berubah menjadi true
  useEffect(() => {
    if (isProcessed) {
      const uniqueParam = new Date().getTime(); // Generate a unique ID based on the current timestamp
      fetchData(uniqueParam, page);
    }
  }, [isProcessed, page]);

  // Filter data berdasarkan query pencarian
  const filteredData = data.filter(row => {
    return (
      row.NRP_NIP?.toLowerCase().includes(searchQuery) ||
      row.NOPENS?.toLowerCase().includes(searchQuery) ||
      row.NIK?.toLowerCase().includes(searchQuery) ||
      (row.NAMA_KEP && row.NAMA_KEP.toLowerCase().includes(searchQuery))
    );
  });

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Fungsi untuk menangani pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div className="container mt-5">
      <div className="mb-3 d-flex justify-content-start">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>&larr; Back</button>
      </div>

      {/* Formulir Input */}
      <div className="d-flex justify-content-start align-items-center mb-3">
        <label className="me-2">Periode:</label>
        <select className="form-select me-2" style={{ width: '150px' }}>
          {/* Pilihan Bulan */}
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <input type="number" className="form-control" placeholder="Year" style={{ width: '100px' }} />
      </div>

      {/* Pilihan Jenis Pembayaran */}
      <div className="d-flex align-items-center mb-3">
        <label className="me-2">Jenis Bayar:</label>
        <input type="text" className="form-control" placeholder="Dapem Induk, Dapem Rape" style={{ width: '200px' }} />
        <div className="form-check ms-3">
          <input className="form-check-input" type="checkbox" id="uncheckAll" />
          <label className="form-check-label" htmlFor="uncheckAll">
            Uncheck All
          </label>
        </div>
      </div>

      {/* Tombol Grid */}
      <div className="d-flex align-items-center mb-4">
        <button className={`btn ${gridView ? 'btn-danger' : 'btn-outline-danger'} me-2`} onClick={handleProcess}>
          Grid
        </button>
        <button className="btn btn-success" onClick={exportToCSV}>
          Ekspor
        </button>
      </div>

      {/* Tabel Data */}
      {gridView && (
        <div className="table-responsive fullscreen-table">
          {loading ? (
            <div>Loading...</div> // Tampilkan loading jika data sedang diambil
          ) : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      Belum ada data. Klik "Grid" untuk memulai perhitungan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className={selectedRow?.NRP_NIP === row.NRP_NIP ? 'table-primary' : ''}
                      onClick={() => setSelectedRow(row)}
                      style={{ cursor: 'pointer' }}
                    >
                      {columns.map((col, idx) => (
                        <td key={idx}>{row[col]}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Navigasi Halaman */}
      {gridView && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-secondary" onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportingPage;
