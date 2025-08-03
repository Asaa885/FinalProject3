import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const ClovePurchase = () => {
  const [sellerType, setSellerType] = useState('');
  const [sellers, setSellers] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [selectedSellerName, setSelectedSellerName] = useState('');
  const [grade, setGrade] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const sellerEndpoints = {
    renter: 'renter/',
    farmer: 'farmer/',
  };

  useEffect(() => {
    if (sellerType && sellerEndpoints[sellerType]) {
      fetchSellers(sellerEndpoints[sellerType]);
    } else {
      setSellers([]);
      setSelectedSellerId('');
    }
  }, [sellerType]);

  const fetchSellers = async (endpoint) => {
    try {
      const res = await axios.get(`${apiBaseUrl}${endpoint}`);
      setSellers(res.data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setSellers([]);
    }
  };

  useEffect(() => {
    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    setTotalPrice(!isNaN(qty) && !isNaN(price) ? qty * price : 0);
  }, [quantity, unitPrice]);

  const handlePurchase = async () => {
    if (!sellerType || !selectedSellerId || !grade || !quantity || !unitPrice) {
      alert('Tafadhali jaza taarifa zote');
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}purchase/`, {
        seller_type: sellerType,
        seller_id: selectedSellerId,
        seller_name: selectedSellerName,
        grade,
        quantity,
        unit_price: unitPrice,
        total: totalPrice,
      });

      alert('Ununuzi na malipo vimefanikiwa!');
      setGrade('');
      setQuantity('');
      setUnitPrice('');
      setSelectedSellerId('');
      setSelectedSellerName('');
      setSellerType('');
    } catch (err) {
      console.error('Transaction error:', err.response?.data || err.message);
      alert('Kuna tatizo kwenye ununuzi au malipo');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Nunua Karafuu & Lipa</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Aina ya Muuzaji</label>
        <select
          className="w-full border p-2 rounded"
          value={sellerType}
          onChange={(e) => setSellerType(e.target.value)}
        >
          <option value="">-- Chagua --</option>
          <option value="renter">Renter</option>
          <option value="farmer">Clove Farmer</option>
        </select>
      </div>

            {sellerType && (
          <div>
            <label className="block mb-1 font-medium">Chagua Muuzaji</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedSellerId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedSellerId(selectedId);
                const selected = sellers.find(
                  (s) => String(s.id) === String(selectedId)
                );
                if (selected) {
                  if (sellerType === 'renter') {
                    setSelectedSellerName(selected.seller_name);
                  } else {
                    setSelectedSellerName(selected.faName);
                  }
                } else {
                  setSelectedSellerName('');
                }
              }}
            >
              <option value="">-- Chagua --</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {sellerType === 'renter' ? seller.seller_name : seller.faName}
                </option>
              ))}
            </select>
          </div>
        )}


      <div className="mb-4">
        <label className="block mb-1 text-sm">Grade ya Karafuu</label>
        <select
          className="w-full border p-2 rounded"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">-- Chagua --</option>
          <option value="Gr1">Gr1</option>
          <option value="Gr2">Gr2</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Kiasi (Kg)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Bei kwa Kilo (Tsh)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
      </div>

      <div className="mb-4 font-semibold">
        Jumla: {totalPrice.toLocaleString()} Tsh
      </div>

      <button
        onClick={handlePurchase}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Thibitisha Malipo na Ununuzi
      </button>
    </div>
  );
};

export default ClovePurchase;