import React from 'react';

const BookingsTable: React.FC = () => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="border px-4 py-2">Kund</th>
          <th className="border px-4 py-2">Tjänst</th>
          <th className="border px-4 py-2">Datum</th>
          <th className="border px-4 py-2">Tid</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Här kan du mappa genom bokningsdata och visa rader */}
        <tr>
          <td className="border px-4 py-2">John Doe</td>
          <td className="border px-4 py-2">Hårklippning</td>
          <td className="border px-4 py-2">2024-11-03</td>
          <td className="border px-4 py-2">10:00</td>
          <td className="border px-4 py-2">Bekräftad</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BookingsTable;