import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [pamount, setPamount] = useState('');
  const [paid_to, setPaid_to] = useState(null); // Changed from '' to null
  const [farm, setFarm] = useState(null);       // Also initialize as null
  const [transactionType, setTransactionType] = useState('rent');
  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/purchase/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handleSelectPurchase = (e) => {
    const purchaseId = parseInt(e.target.value);
    if (!purchaseId) {
      setPaid_to(null);
      setFarm(null);
      return;
    }
    const purchase = purchases.find(p => p.id === purchaseId);
    if (purchase) {
      setPaid_to(purchase.seller_id);
      setFarm(purchase.farm ? purchase.farm.id : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pamount || parseFloat(pamount) <= 0 || paid_to === null) {
      setMessage('Amount and Paid To are required');
      return;
    }

    try {
      const paymentData = {
        pamount,
        paid_to,
        farm,
        transaction_type: transactionType,
      };

      const response = await axios.post('http://127.0.0.1:8000/api/payment/', paymentData, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        } : {}
      });

      setMessage('Payment submitted successfully!');
      setPamount('');
      setPaid_to(null);
      setFarm(null);
      setTransactionType('rent');
      await fetchPurchases();
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setMessage('Failed to submit payment');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>

      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Amount (TZS)</label>
          <input
            type="number"
            value={pamount}
            onChange={(e) => setPamount(e.target.value)}
            className="w-full border rounded p-2"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Purchase</label>
          <select
            value={paid_to !== null ? purchases.find(p => p.seller_id === paid_to)?.id || '' : ''}
            onChange={handleSelectPurchase}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Select a Purchase --</option>
            {purchases.map(purchase => (
              <option key={purchase.id} value={purchase.id}>
                Seller: {purchase.seller_type} ({purchase.seller_id}) - Grade: {purchase.grade} - Total: {purchase.total}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="rent">Rent Payment</option>
            <option value="clove_sale">Clove Sale Payment</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
