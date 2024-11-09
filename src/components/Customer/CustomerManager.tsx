import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './CustomerManager.scss'; // Import any additional custom SCSS here if needed

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
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6 mb-7 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Hantera Kunder</h2>
      
      <form onSubmit={handleAddOrUpdateCustomer} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Namn:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">E-post:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded w-full p-3 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
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
        <p className="text-gray-500 mt-4">Inga kunder tillgängliga.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {customers.map((customer) => (
            <li key={customer.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{customer.name}</span>
                <span className="text-gray-600 text-sm">E-post: {customer.email}</span>
                <span className="text-gray-600 text-sm">Telefon: {customer.phone}</span>
              </div>
              <div className="flex space-x-2">
              <button
  onClick={() => handleEdit(customer)}
  className="bg-blue-500 text-white px-4 py-2 rounded-md flex justify-center items-center"
>
  <FontAwesomeIcon icon={faEdit} />
</button>
<button
  onClick={() => handleDelete(customer.id)}
  className="bg-red-500 text-white px-4 py-2 rounded-md flex justify-center items-center"
>
  <FontAwesomeIcon icon={faTrash} />
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








