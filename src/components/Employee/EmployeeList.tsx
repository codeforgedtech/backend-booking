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
        const { data: employeesData, error: employeesError } = await supabase
          .from('users')
          .select('id, email, role, display_name, created_at');
        if (employeesError) throw new Error(`Error fetching employees: ${employeesError.message}`);

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, description');
        if (servicesError) throw new Error(`Error fetching services: ${servicesError.message}`);

        const { data: employeeServicesData, error: employeeServicesError } = await supabase
          .from('employee_services')
          .select('employee_id, service_id');
        if (employeeServicesError) throw new Error(`Error fetching employee services: ${employeeServicesError.message}`);

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

  // Handle deletion of an employee
  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      // Step 1: Delete associated service in employee_services table
      const { error: serviceError } = await supabase
        .from('employee_services')
        .delete()
        .eq('employee_id', employeeId);

      if (serviceError) throw new Error(`Error deleting employee service: ${serviceError.message}`);

      // Step 2: Delete the employee from users table
      const { error: userError } = await supabase.from('users').delete().eq('id', employeeId);

      if (userError) throw new Error(`Error deleting employee: ${userError.message}`);

      setSuccessMessage('Medarbetare har tagits bort.');
      setError(null);

      // Remove the deleted employee from state
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== employeeId));
    } catch (error) {
      console.error(error);
      setError('Kunde inte ta bort medarbetaren.');
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
            <li key={employee.id} className="border rounded-lg p-4 mb-4 bg-gray-100 hover:bg-gray-200 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{employee.display_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Email: {employee.email}</p>
                  <p className="text-sm text-gray-600">Skapad: {new Date(employee.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col items-end">
                  {employee.currentServiceName ? (
                    <p className="font-semibold text-gray-800 text-sm">{employee.currentServiceName}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Ingen tjänst tilldelad</p>
                  )}
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="mt-2 bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 text-sm"
                  >
                    Ta bort Medarbetare
                  </button>
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






