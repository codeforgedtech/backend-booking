import React from 'react';

const BookingConfirmation: React.FC = () => {
  return (
    <div className="text-center p-6 bg-green-100 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Bokningen är bekräftad!</h2>
      <p>Du har bokat din tid. Vi ser fram emot att hjälpa dig!</p>
    </div>
  );
};

export default BookingConfirmation;