import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './CustomerManager.scss'; // Import any additional custom SCSS here if needed
import CustomerForm from './CustomForm';

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
      
     <CustomerForm onSuccess={function (): void {
        throw new Error('Function not implemented.');
      } } onError={function (message: string): void {
        throw new Error('Function not implemented.');
      } }/>

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








