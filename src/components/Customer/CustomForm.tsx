import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  selectedCustomer?: Customer;
  onSuccess: () => void; // callback för att uppdatera listan efter tillägg/uppdatering
  onError: (message: string) => void; // callback för felhantering
}

const CustomerForm: React.FC<CustomerFormProps> = ({ selectedCustomer, onSuccess, onError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      setName(selectedCustomer.name);
      setEmail(selectedCustomer.email);
      setPhone(selectedCustomer.phone);
      setIsUpdating(true);
    } else {
      resetForm();
    }
  }, [selectedCustomer]);

  const handleAddOrUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      onError('Vänligen fyll i alla fält.');
      return;
    }

    try {
      if (isUpdating && selectedCustomer?.id) {
        // Uppdatera en befintlig kund
        const { error } = await supabase
          .from('customers')
          .update({ name, email, phone })
          .eq('id', selectedCustomer.id);

        if (error) throw error;
      } else {
        // Lägg till en ny kund
        const { error } = await supabase.from('customers').insert([{ name, email, phone }]);
        if (error) throw error;
      }

      onSuccess(); // Används för att uppdatera listan i huvudkomponenten
      resetForm();
    } catch (error: any) {
      onError(error.message);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setIsUpdating(false);
  };

  return (
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
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        {isUpdating ? 'Uppdatera Kund' : 'Lägg till Kund'}
      </button>
    </form>
  );
};

export default CustomerForm;

