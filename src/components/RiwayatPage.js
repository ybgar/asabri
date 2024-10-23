import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import axios for API calls

const RiwayatPage = () => {
  const [data, setData] = useState([]); // Store historical data from localStorage
  const [searchQuery, setSearchQuery] = useState(''); // Store search query
  const [loading, setLoading] = useState(true); // Store loading status
  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows from checkboxes
  const [selectedPeriod, setSelectedPeriod] = useState(''); // Store selected period
  const [selectedYear, setSelectedYear] = useState(''); // Store selected year
  const [monthMap, setMonthMap] = useState({
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  }); // Map of month names to their corresponding numbers

  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // Fetch historical data from localStorage
    const riwayatData = JSON.parse(localStorage.getItem('riwayatData')) || [];
    setData(riwayatData);
    setLoading(false);
  }, []);

  // Jika ReportingPage tetap ingin menampilkan data dari server atau sumber lain
  useEffect(() => {
    const fetchReportingData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data/all', {
          params: {
            month: monthMap[selectedPeriod],
            year: selectedYear,
          },
        });
        setData(response.data.recordset); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call fetch function only if selectedPeriod and selectedYear are valid
    if (selectedPeriod && selectedYear) {
      fetchReportingData();
    }
  }, [selectedPeriod, selectedYear]);

  // Function to add/remove selected rows to/from selectedRows
  const handleSelectRow = (item) => {
    const selectedIndex = selectedRows.findIndex(row => row.NRP_NIP === item.NRP_NIP);
    if (selectedIndex > -1) {
      // If item is already in selectedRows, remove it
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(newSelectedRows);
    } else {
      // If item is not in selectedRows, add it
      setSelectedRows([...selectedRows, item]);
    }
  };

  // Fungsi untuk menghasilkan BLNBYR dengan bulan acak (01-12)
  const generateRandomMonthBLNBYR = (BLNBYR) => {
    // Ambil tahun dari BLNBYR (YYYYMM)
    const yearPart = BLNBYR.slice(0, 4); // Misalnya 2024
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // Acak 01-12
    return `${yearPart}${randomMonth}`; // Gabungkan kembali dengan bulan acak
  };

  // Function to delete selected rows from the table and localStorage
  const handleDeleteSelected = () => {
    const remainingData = data.filter(item => !selectedRows.includes(item));

    // Hapus data yang dipilih tanpa memindahkannya ke reporting page
    setData(remainingData);
    localStorage.setItem('riwayatData', JSON.stringify(remainingData));
    setSelectedRows([]);
    alert('Data yang dipilih berhasil dihapus dari riwayat.'); // Update alert message
  };

  // Function to ensure the value is a number
  const parseCurrency = (value) => {
    if (value && typeof value === 'string') {
      return parseInt(value.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
    }
    return typeof value === 'number' ? value : 0;
  };

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      (item?.NRP_NIP?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item?.NOPENS?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item?.NIK?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item?.NAMA_KEP?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk memilih bulan secara acak
  const getRandomMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const randomIndex = Math.floor(Math.random() * months.length);
    return months[randomIndex];
  };

  // Fungsi untuk memindahkan data ke halaman laporan
  const moveToReportingPage = (deletedData) => {
    const reportingData = JSON.parse(localStorage.getItem('reportingData')) || [];
    
    // Tambahkan data yang dihapus ke localStorage
    const updatedReportingData = [...reportingData, ...deletedData];
    localStorage.setItem('reportingData', JSON.stringify(updatedReportingData));
  };

  // Function to delete data from RiwayatPage and move it to ReportingPage
  const deleteDataFromRiwayat = async () => {
    try {
      const selectedPeriod = `${monthMap[selectedPeriod]}-${selectedYear}`;  // Mengambil bulan dan tahun dari state
      await axios.post('http://localhost:5000/api/delete-and-move', { selectedPeriod });  // Panggil API untuk menghapus dan memindahkan data
      alert(`Data berhasil dipindahkan ke periode ${selectedPeriod}`);
    } catch (error) {
      console.error('Error deleting and moving data:', error);
      alert('Terjadi kesalahan saat memindahkan data.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Back Button */}
        <button className="btn btn-secondary" onClick={() => navigate(-1)}> {/* Go back to the previous page */}
          &larr; Back
        </button>
        <h3 className="mb-0">Riwayat Data</h3>
      </div>

      {/* Search Input */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari NRP/NIP, NOPENS, NIK..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Delete button for selected rows */}
        {selectedRows.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteSelected}>
            Hapus {selectedRows.length} Data yang Dipilih
          </button>
        )}
      </div>

      {/* History Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Pilih</th>
            <th>No</th>
            <th>NRP/NIP</th>
            <th>No Pens</th>
            <th>Bulan Bayar</th>
            <th>NIK</th>
            <th>Pensiun Pokok</th>
            <th>Kode Jiwa</th>
            <th>PPh 21 TER</th>
            <th>Nama sesuai KEP</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center">Loading...</td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                {/* Checkbox for selecting rows */}
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item)}
                    onChange={() => handleSelectRow(item)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{item?.NRP_NIP || '-'}</td>
                <td>{item?.NOPENS || '-'}</td>
                <td>{item?.BLNBYR || '-'}</td>
                <td>{item?.NIK || '-'}</td>
                <td>{item?.PENS_POKOK || '-'}</td>
                <td>{item?.Kode_Jiwa || '-'}</td>
                <td>{item?.PPH_21_TER || '-'}</td>
                <td>{item?.NAMA_KEP || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">Tidak ada data riwayat</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Display Totals if there is data */}
      {!loading && filteredData.length > 0 && (
        <tfoot>
          <tr>
            <td colSpan="5" className="text-end">TOTAL</td>
            <td>
              {/* Total Pensiun Pokok */}
              {filteredData
                .reduce((acc, item) => acc + parseCurrency(item?.PENS_POKOK), 0)
                .toLocaleString('id-ID')}
            </td>
            <td colSpan="2" className="text-end">Total PPh 21 TER</td>
            <td colSpan="2">
              {/* Total PPh 21 */}
              {filteredData
                .reduce((acc, item) => acc + parseCurrency(item?.PPH_21_TER), 0)
                .toLocaleString('id-ID')}
            </td>
          </tr>
        </tfoot>
      )}
    </div>
  );
};

export default RiwayatPage;