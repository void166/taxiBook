export interface Booking {
  id: string;
  name: string;
  phone: string;
  from: string;
  to: string;
  passengers: number;
  luggage: number;
  carSize: string;
  hasChild: boolean;
  hasPet: boolean;
  departureTime: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const STORAGE_KEY = 'nordic_taxi_bookings';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    name: 'Anna Lindström',
    phone: '070-123 45 67',
    from: 'Uppsala Central',
    to: 'Arlanda Airport',
    passengers: 2,
    luggage: 2,
    carSize: 'Standard',
    hasChild: false,
    hasPet: false,
    departureTime: '2026-04-12 08:30',
    price: 595,
    status: 'completed',
    createdAt: '2026-04-11 14:20',
  },
  {
    id: 'BK-002',
    name: 'Erik Johansson',
    phone: '073-456 78 90',
    from: 'Arlanda Airport',
    to: 'Uppsala City',
    passengers: 4,
    luggage: 4,
    carSize: 'Comfort',
    hasChild: true,
    hasPet: false,
    departureTime: '2026-04-12 11:00',
    price: 595,
    status: 'pending',
    createdAt: '2026-04-11 16:45',
  },
  {
    id: 'BK-003',
    name: 'Maria Svensson',
    phone: '076-789 01 23',
    from: 'Uppsala University',
    to: 'Arlanda Terminal 5',
    passengers: 1,
    luggage: 1,
    carSize: 'Standard',
    hasChild: false,
    hasPet: true,
    departureTime: '2026-04-12 14:15',
    price: 595,
    status: 'pending',
    createdAt: '2026-04-11 18:00',
  },
  {
    id: 'BK-004',
    name: 'Lars Petersson',
    phone: '072-234 56 78',
    from: 'Gottsunda',
    to: 'Arlanda Airport',
    passengers: 6,
    luggage: 5,
    carSize: 'Van',
    hasChild: false,
    hasPet: false,
    departureTime: '2026-04-12 06:00',
    price: 1095,
    status: 'completed',
    createdAt: '2026-04-10 09:30',
  },
  {
    id: 'BK-005',
    name: 'Sofia Nilsson',
    phone: '079-345 67 89',
    from: 'Uppsala Central',
    to: 'Arlanda T2',
    passengers: 3,
    luggage: 3,
    carSize: 'Standard',
    hasChild: true,
    hasPet: false,
    departureTime: '2026-04-13 07:45',
    price: 595,
    status: 'pending',
    createdAt: '2026-04-11 20:10',
  },
  {
    id: 'BK-006',
    name: 'Björn Karlsson',
    phone: '070-567 89 01',
    from: 'Arlanda Airport',
    to: 'Uppsala Centrum',
    passengers: 2,
    luggage: 3,
    carSize: 'Standard',
    hasChild: false,
    hasPet: false,
    departureTime: '2026-04-13 15:30',
    price: 595,
    status: 'pending',
    createdAt: '2026-04-12 08:00',
  },
];

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
      return MOCK_BOOKINGS;
    }
    return JSON.parse(raw) as Booking[];
  } catch {
    return MOCK_BOOKINGS;
  }
}

export function addBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `BK-${String(Date.now()).slice(-4)}`,
    status: 'pending',
    createdAt: new Date().toLocaleString('sv-SE', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }),
  };
  const existing = getBookings();
  existing.unshift(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking['status']): void {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }
}

export function deleteBooking(id: string): void {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}
