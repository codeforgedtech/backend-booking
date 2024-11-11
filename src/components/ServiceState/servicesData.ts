export const services = [
  { id: 1, name: 'Tjänst 1', description: 'Beskrivning för tjänst 1', price: 500, category_id: 1 },
  { id: 2, name: 'Tjänst 2', description: 'Beskrivning för tjänst 2', price: 300, category_id: 2 },
  // Lägg till fler tjänster
];

export const categories = [
  { id: 1, name: 'Kategori 1' },
  { id: 2, name: 'Kategori 2' },
  // Lägg till fler kategorier
];

export const bookings = [
  { id: 1, service_id: 1, date: '2024-11-01', payment_status: 'Paid' },
  { id: 2, service_id: 2, date: '2024-11-02', payment_status: 'Pending' },
  // Lägg till fler bokningar
];