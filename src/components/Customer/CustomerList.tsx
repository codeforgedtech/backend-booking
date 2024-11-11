import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="max-w-lg mx-auto mt-6">
      <h3 className="text-xl font-semibold text-gray-800">Befintliga Kunder</h3>
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
                  onClick={() => onEdit(customer)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
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

export default CustomerList;
