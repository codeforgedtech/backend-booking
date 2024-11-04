import React from 'react';

interface BookingFormProps {
  onBookingConfirmed: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingConfirmed }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onBookingConfirmed();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select className="border p-2 w-full rounded-md" required>
        <option value="">Välj tjänst</option>
        <option value="haircut">Hårklippning</option>
        <option value="coloring">Färgning</option>
      </select>
      <input type="date" className="border p-2 w-full rounded-md" required />
      <input type="time" className="border p-2 w-full rounded-md" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Boka nu
      </button>
    </form>
  );
};

export default BookingForm;