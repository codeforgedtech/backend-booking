// AvailableSlots.tsx
import React from 'react';

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  service_id: string;
}

interface Service {
  id: string;
  name: string;
  provider: string;
}

interface AvailableSlotsProps {
  selectedDate: Date | null;
  filteredSlots: Slot[];
  services: Service[];
  formatTime: (time: string) => string;
}

const AvailableSlots: React.FC<AvailableSlotsProps> = ({ selectedDate, filteredSlots, services, formatTime }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">
        {selectedDate ? `Lediga tider för ${selectedDate.toLocaleDateString('sv-SE')}` : 'Välj en dag för att visa tillgängliga tider'}
      </h3>

      {filteredSlots.length > 0 ? (
        <div className="mt-4 space-y-4">
          {filteredSlots.map((slot) => {
            const service = services.find((s) => s.id === slot.service_id);
            return (
              <div
                key={slot.id}
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Tid: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Tjänst: {service?.name || 'Okänd tjänst'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Utförare: {service?.provider || 'Okänd utförare'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        selectedDate && <p className="text-gray-500 mt-4">Inga tillgängliga tider för den här dagen.</p>
      )}
    </div>
  );
};

export default AvailableSlots;
