import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface Employee {
  id: string;
  email: string;
  role: string;
  display_name: string;
  created_at: string;
  selectedService?: string;
  currentServiceName?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingServiceEmployeeId, setEditingServiceEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('users')
          .select('id, email, role, display_name, created_at');

        if (employeesError) throw new Error(`Error fetching employees: ${employeesError.message}`);

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, description');

        if (servicesError) throw new Error(`Error fetching services: ${servicesError.message}`);

        // Fetch employee services
        const { data: employeeServicesData, error: employeeServicesError } = await supabase
          .from('employee_services')
          .select('employee_id, service_id');

        if (employeeServicesError) throw new Error(`Error fetching employee services: ${employeeServicesError.message}`);

        // Map services to employees
        const updatedEmployees = employeesData?.map((employee) => {
          const serviceAssignment = employeeServicesData?.find(
            (service) => service.employee_id === employee.id
          );
          if (serviceAssignment) {
            const service = servicesData?.find((service) => service.id === serviceAssignment.service_id);
            return {
              ...employee,
              selectedService: service?.id,
              currentServiceName: service?.name,
            };
          }
          return employee;
        });

        setEmployees(updatedEmployees || []);
        setServices(servicesData || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Kunde inte hämta medarbetare eller tjänster.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignService = async (employeeId: string, serviceId: string) => {
    try {
      const { data, error } = await supabase.from('employee_services').insert([
        { employee_id: employeeId, service_id: serviceId },
      ]);

      if (error) throw new Error(`Error assigning service: ${error.message}`);

      setSuccessMessage('Tjänst har tilldelats medarbetaren.');
      setError(null);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? { ...employee, selectedService: serviceId } : employee
        )
      );
    } catch (error) {
      console.error(error);
      setError('Kunde inte tilldela tjänst.');
    }
  };

  const handleServiceChange = (employeeId: string, serviceId: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId ? { ...employee, selectedService: serviceId } : employee
      )
    );
  };

  const handleUpdateService = async (employeeId: string, serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('employee_services')
        .upsert([{ employee_id: employeeId, service_id: serviceId }]);

      if (error) throw new Error(`Error updating service: ${error.message}`);

      setSuccessMessage('Tjänst har uppdaterats.');
      setError(null);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId
            ? { ...employee, selectedService: serviceId, currentServiceName: services.find((s) => s.id === serviceId)?.name }
            : employee
        )
      );

      setEditingServiceEmployeeId(null);
    } catch (error) {
      console.error(error);
      setError('Kunde inte uppdatera tjänst.');
    }
  };

  if (loading) return <p>Laddar medarbetare...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Medarbetare</h2>
  
    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
  
    {employees.length === 0 ? (
      <p>Inga medarbetare hittades.</p>
    ) : (
      <ul>
        {employees.map((employee) => (
          <li
            key={employee.id}
            className="border rounded-lg p-4 mb-4 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">{employee.display_name || 'N/A'}</p>
                <p className="text-sm text-gray-600">Email: {employee.email}</p>
                <p className="text-sm text-gray-600">Skapad: {new Date(employee.created_at).toLocaleDateString()}</p>
              </div>
  
              <div>
                {employee.currentServiceName ? (
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{employee.currentServiceName}</p>
                    <button
                      onClick={() => setEditingServiceEmployeeId(employee.id)} // Enable the service edit mode
                      className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm ml-auto"
                    >
                      Ändra Tjänst
                    </button>
  
                    {editingServiceEmployeeId === employee.id && (
                      <div className="mt-4">
                        <select
                          value={employee.selectedService || ''}
                          onChange={(e) => handleServiceChange(employee.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Välj Tjänst</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))}
                        </select>
  
                        <button
                          onClick={() => handleUpdateService(employee.id, employee.selectedService!)}
                          className="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition duration-200 "
                        >
                          Uppdatera Tjänst
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <select
                      value={employee.selectedService || ''}
                      onChange={(e) => handleServiceChange(employee.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Välj Tjänst</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
  
                    <button
                      onClick={() => handleAssignService(employee.id, employee.selectedService!)}
                      className="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Tilldela Tjänst
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default EmployeeList;





