import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

interface OpenHour {
  id: number; // Lägg till id för att kunna uppdatera öppettiderna
  day: string;
  open_time: string;
  close_time: string;
}

const OpeningHours: React.FC = () => {
  const [openHours, setOpenHours] = useState<OpenHour[]>([]);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<OpenHour | null>(null);

  useEffect(() => {
    fetchOpenHours();
  }, []);

  // Hämta öppettider från Supabase
  const fetchOpenHours = async () => {
    const { data, error } = await supabase.from('open_hours').select('*').order('id');
    if (error) {
      console.error('Error fetching open hours:', error);
    } else {
      setOpenHours(data || []);
      checkIfOpenNow(data || []);
    }
  };

  // Kontrollera om det är öppet just nu
  const checkIfOpenNow = (hours: OpenHour[]) => {
    const today = new Date().toLocaleDateString('sv-SE', { weekday: 'short' });
    const currentTime = new Date().toTimeString().slice(0, 5);

    const todayHours = hours.find((hour) => hour.day === today);
    if (todayHours && todayHours.open_time !== 'Stängd' && todayHours.close_time !== 'Stängd') {
      setIsOpenNow(currentTime >= todayHours.open_time && currentTime <= todayHours.close_time);
    } else {
      setIsOpenNow(false);
    }
  };

  // Öppna modal för att redigera en specifik dag
  const openEditModal = (day: OpenHour) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  // Stäng modal och återställ valt dag
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  // Hantera ändring av tid
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDay) {
      setSelectedDay({ ...selectedDay, [e.target.name]: e.target.value });
    }
  };

  // Spara ändringar till Supabase
  const handleSave = async () => {
    if (selectedDay) {
      const { error } = await supabase
        .from('open_hours')
        .update({
          open_time: selectedDay.open_time === '' ? 'Stängd' : selectedDay.open_time,
          close_time: selectedDay.close_time === '' ? 'Stängd' : selectedDay.close_time,
        })
        .eq('id', selectedDay.id);

      if (error) {
        console.error('Error updating open hours:', error);
      } else {
        fetchOpenHours(); // Uppdatera listan med nya värden
        closeModal();
      }
    }
  };

  return (
    <div className="mmax-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {isOpenNow ? 'Öppet nu' : 'Stängt nu'}
      </h2>
      <ul className="space-y-1 text-gray-700">
        {openHours.map((hour) => (
          <li key={hour.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{hour.day}</span>
              <span className="ml-2">
                {hour.open_time === 'Stängd' ? 'Stängd' : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
            <button
              onClick={() => openEditModal(hour)}
              className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded-lg hover:bg-yellow-700 text-sm"
            >
              Ändra
            </button>
          </li>
        ))}
      </ul>

      {/* Modal för att redigera öppettider */}
      {isModalOpen && selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Redigera öppettider för {selectedDay.day}</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Öppnar:</label>
                <input
                  type="text"
                  name="open_time"
                  value={selectedDay.open_time === 'Stängd' ? '' : selectedDay.open_time}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
                  placeholder="t.ex. 10:00 eller lämna tomt för Stängd"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Stänger:</label>
                <input
                  type="text"
                  name="close_time"
                  value={selectedDay.close_time === 'Stängd' ? '' : selectedDay.close_time}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
                  placeholder="t.ex. 18:00 eller lämna tomt för Stängd"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Spara
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningHours;



