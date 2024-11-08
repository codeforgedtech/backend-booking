import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface Employee {
  id: string;
  email: string;
  role: string;
  display_name: string;
  created_at: string;
  selectedService?: string; // Store the selected service for each employee
  currentServiceName?: string; // Store the service name for the employee
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
  const [editingServiceEmployeeId, setEditingServiceEmployeeId] = useState<string | null>(null); // Track employee under editing

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees from the "users" table
        const { data: employeesData, error: employeesError } = await supabase
          .from('users')
          .select('id, email, role, display_name, created_at');

        if (employeesError) {
          throw new Error(`Error fetching employees: ${employeesError.message}`);
        }

        // Fetch services from the "services" table
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, description');

        if (servicesError) {
          throw new Error(`Error fetching services: ${servicesError.message}`);
        }

        setEmployees(employeesData || []);
        setServices(servicesData || []);

        // Fetch employee service assignments
        const { data: employeeServicesData, error: employeeServicesError } = await supabase
          .from('employee_services')
          .select('employee_id, service_id');

        if (employeeServicesError) {
          throw new Error(`Error fetching employee services: ${employeeServicesError.message}`);
        }

        // Map the services to employees
        const updatedEmployees = employeesData?.map((employee) => {
          const serviceAssignment = employeeServicesData?.find(
            (service) => service.employee_id === employee.id
          );
          if (serviceAssignment) {
            const service = servicesData?.find(
              (service) => service.id === serviceAssignment.service_id
            );
            return {
              ...employee,
              selectedService: service?.id,
              currentServiceName: service?.name,
            };
          }
          return employee;
        });

        setEmployees(updatedEmployees || []);
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
      // Insert the service assignment into the employee_services join table
      const { data, error } = await supabase.from('employee_services').insert([
        {
          employee_id: employeeId,
          service_id: serviceId,
        },
      ]);

      if (error) {
        throw new Error(`Error assigning service: ${error.message}`);
      }

      setSuccessMessage('Tjänst har tilldelats medarbetaren.');
      setError(null);

      // Update the employee's selected service in the state
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
      // Update the service for the employee in the employee_services table
      const { data, error } = await supabase
        .from('employee_services')
        .upsert([
          {
            employee_id: employeeId,
            service_id: serviceId,
          },
        ]);

      if (error) {
        throw new Error(`Error updating service: ${error.message}`);
      }

      setSuccessMessage('Tjänst har uppdaterats.');
      setError(null);

      // Update the employee's selected service and name in the state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId ? { ...employee, selectedService: serviceId, currentServiceName: services.find((s) => s.id === serviceId)?.name } : employee
        )
      );

      // Close the "edit service" state after update
      setEditingServiceEmployeeId(null);

    } catch (error) {
      console.error(error);
      setError('Kunde inte uppdatera tjänst.');
    }
  };

  if (loading) return <p>Laddar medarbetare...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Medarbetare</h2>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {employees.length === 0 ? (
        <p>Inga medarbetare hittades.</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id} className="mb-4 p-4 border-b border-gray-200">
              <p className="text-black"><strong>Namn:</strong> {employee.display_name || 'N/A'}</p>
              <p className="text-black"><strong>Email:</strong> {employee.email}</p>
              <p className="text-black"><strong>Skapad:</strong> {new Date(employee.created_at).toLocaleDateString()}</p>

              <div className="mt-4">
                {employee.currentServiceName ? (
                  <div>
                    <p><strong>Tjänst:</strong> {employee.currentServiceName}</p>
                    <button
                      onClick={() => setEditingServiceEmployeeId(employee.id)} // Enable the service edit mode
                      className="mt-2 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
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
                          className="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg hover:bg-blue-700 transition duration-200"
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;




