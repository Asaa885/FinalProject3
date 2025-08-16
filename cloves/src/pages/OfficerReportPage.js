import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OfficerReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch report data from backend
  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/officer/report/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(response.data);
    } catch (err) {
      console.error('Fetch report error:', err);
      setError('Failed to fetch report.');
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF
  const printPDF = () => {
    if (!report) return;

    const doc = new jsPDF();

    // Payment Table
    doc.text('Payment Report', 14, 15);
    autoTable(doc, {
      head: [['ID', 'Amount', 'From', 'To', 'Date']],
      body: report.payment.map(p => [
        p.id,
        Number(p.pamount).toLocaleString(),
        p.paid_from?.username || 'N/A',
        p.paid_to?.username || 'N/A',
        p.date
      ]),
      startY: 20
    });

    // Purchases Table
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 20;
    doc.text('Purchases Report', 14, finalY + 10);
    autoTable(doc, {
      head: [['ID', 'Seller', 'Type', 'Grade', 'Quantity', 'Total']],
      body: report.purchase.map(p => [
        p.id,
        p.seller?.username || 'N/A',
        p.seller_type,
        p.grade,
        Number(p.quantity).toLocaleString(),
        Number(p.total).toLocaleString()
      ]),
      startY: finalY + 15
    });

    doc.save('officer_report.pdf');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Officer Report</h2>

      <div className="mb-4">
        <button
          onClick={fetchReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2"
        >
          {loading ? 'Fetching...' : 'Fetch Report'}
        </button>

        <button
          onClick={printPDF}
          disabled={!report}
          className={`px-4 py-2 rounded ${
            report ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Generate PDF
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {report && (
        <div>
          <h3 className="font-semibold mt-4 mb-2">Payments</h3>
          <table className="table-auto border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">From</th>
                <th className="border px-2 py-1">To</th>
                <th className="border px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {report.payment.map(p => (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.id}</td>
                  <td className="border px-2 py-1">{Number(p.pamount).toLocaleString()}</td>
                  <td className="border px-2 py-1">{p.paid_from?.username || 'N/A'}</td>
                  <td className="border px-2 py-1">{p.paid_to?.username || 'N/A'}</td>
                  <td className="border px-2 py-1">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="font-semibold mt-4 mb-2">Purchases</h3>
          <table className="table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Seller</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Grade</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.purchase.map(p => (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.id}</td>
                  <td className="border px-2 py-1">{p.seller?.username || 'N/A'}</td>
                  <td className="border px-2 py-1">{p.seller_type}</td>
                  <td className="border px-2 py-1">{p.grade}</td>
                  <td className="border px-2 py-1">{Number(p.quantity).toLocaleString()}</td>
                  <td className="border px-2 py-1">{Number(p.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfficerReportPage;
