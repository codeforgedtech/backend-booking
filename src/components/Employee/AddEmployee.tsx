import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

interface Service {
  id: string;
  name: string;
}

const AddEmployee: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('id, name');
      if (error) {
        console.error('Error fetching services:', error);
        setErrorMessage('Kunde inte hämta tjänster.');
      } else {
        setServices(data || []);
      }
    };

    fetchServices();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        setErrorMessage(`Authentication error: ${authError.message}`);
        setSuccessMessage(null);
        return;
      }

      // Step 2: Insert employee data in the custom "users" table
      const id = uuidv4();
      const password_hash = bcrypt.hashSync(password, 10);
      const created_at = new Date().toISOString();

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ id, email, password_hash, role, created_at }]);

      if (userError) {
        console.error('Error adding user to database:', userError);
        setErrorMessage(`Database error: ${userError.message || 'Unknown database error'}`);
        setSuccessMessage(null);
        return;
      }

      // Step 3: Associate employee with a service
      if (serviceId) {
        const { error: assocError } = await supabase
          .from('employee_services')
          .insert([{ employee_id: id, service_id: serviceId }]);

        if (assocError) {
          console.error('Error associating employee with service:', assocError);
          setErrorMessage(`Error associating with service: ${assocError.message}`);
          return;
        }
      }

      setSuccessMessage('Medarbetare tillagd med specifik tjänst!');
      setErrorMessage(null);
      setEmail('');
      setPassword('');
      setRole('');
      setServiceId(null);
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('Ett oväntat fel inträffade.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lägg till Medarbetare</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleAddEmployee}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Lösenord:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700">Roll:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="service" className="block text-gray-700">Tjänst:</label>
          <select
            id="service"
            value={serviceId || ''}
            onChange={(e) => setServiceId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Välj tjänst</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Lägg till Medarbetare
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;



