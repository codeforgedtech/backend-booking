// src/components/CustomerManager.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error: supabaseError } = await supabase.from('customers').select('*');
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddOrUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !email || !phone) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    if (selectedCustomerId) {
      // Update existing customer
      const { error: supabaseError } = await supabase
        .from('customers')
        .update({ name, email, phone })
        .eq('id', selectedCustomerId);
      
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchCustomers();
      }
    } else {
      // Add new customer
      const { error: supabaseError } = await supabase
        .from('customers')
        .insert([{ name, email, phone }]);
      
      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess(true);
        resetForm();
        fetchCustomers();
      }
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSelectedCustomerId(null);
  };

  const handleEdit = (customer: Customer) => {
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setSelectedCustomerId(customer.id);
  };

  const handleDelete = async (customerId: string) => {
    const { error: supabaseError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);
    
    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      fetchCustomers();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
        Hantera Kunder
      </h2>
      <form onSubmit={handleAddOrUpdateCustomer}>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Namn:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">E-post:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Telefon:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Kunden har lagts till/uppdaterats!</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {selectedCustomerId ? 'Uppdatera Kund' : 'Lägg till Kund'}
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-800 mt-6">Befintliga Kunder</h3>
      {customers.length === 0 ? (
        <p>Inga kunder tillgängliga.</p>
      ) : (
        <ul className="list-disc pl-5">
          {customers.map((customer) => (
            <li key={customer.id} className="flex justify-between items-center mb-2 bg-gray-100 p-4 rounded-md shadow-sm">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{customer.name}</div>
                <p className="text-gray-600">E-post: {customer.email}</p>
                <p className="text-gray-600">Telefon: {customer.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  Redigera
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerManager;
