import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SignInModal from './components/SignInModal';
import FilmsCatalog from './components/FilmsCatalog';
import AdminDashboard from './components/AdminDashboard';
import MyBookings from './components/MyBookings';
import MovieDetailsModal from './components/MovieDetailsModal';
import SeatSelectionScreen from './components/SeatSelectionScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';
import PaymentScreen from './components/PaymentScreen';
import BookingConfirmedScreen from './components/BookingConfirmedScreen';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_FILMS = [
  {
    id: 1,
    title: 'Neon Frontier',
    genre: 'Sci-Fi',
    duration: '142m',
    rating: 'PG-13',
    year: '2026',
    director: 'Alex Rivera',
    cast: 'David Chen, Sarah Jenkins, Lucas Vance',
    description: 'In a neon-drenched metropolis controlled by artificial intelligence, a rogue operative discovers a dark conspiracy that threatens to erase human consciousness.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'The Venetian Heist',
    genre: 'Thriller',
    duration: '118m',
    rating: 'R',
    year: '2026',
    director: 'Marco Rossi',
    cast: 'Elena Vance, Lucas Thorne, Roberto Blanc',
    description: 'An international team of master thieves plan an audacious robbery during the high tide festival in Venice, navigating treacherous waters and betrayal.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Ember & Ash',
    genre: 'Drama',
    duration: '126m',
    rating: 'PG-13',
    year: '2025',
    director: 'Sofia Al-Mansoor',
    cast: 'Claire Redfield, Julian Vance, Hannah Kim',
    description: 'A powerful family saga following two estranged siblings fighting to protect their ancestral vineyard amidst environmental challenges.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Razorback',
    genre: 'Action',
    duration: '108m',
    rating: 'R',
    year: '2026',
    director: 'Jaxom Steele',
    cast: 'Marcus Stone, Amanda Drake, Ray Jackson',
    description: 'Stranded in the unforgiving Australian wilderness, a former special ops officer must outsmart a ruthless mercenary syndicate.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'The Laughing Fox',
    genre: 'Comedy',
    duration: '95m',
    rating: 'PG',
    year: '2026',
    director: 'Oliver Hayes',
    cast: 'Benny Hill, Zoe Cooper, Charles Sterling',
    description: 'An eccentric estate manager accidentally hosts three competing wedding parties at the exact same English manor on the same weekend.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Whispers in the Deep',
    genre: 'Horror',
    duration: '112m',
    rating: 'R',
    year: '2026',
    director: 'Naomi Watts',
    cast: 'Ethan Hawke, Maya Lin, Sam Rockwell',
    description: 'Deep sea oceanographers investigating an unmapped trench discover an ancient underwater structure harboring horrors from beyond time.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  }
];

export default function App() {
  const [films, setFilms] = useState(INITIAL_FILMS);
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'USER',
    token: 'mock-jwt-token'
  });

  const [activeTab, setActiveTab] = useState('films'); // 'films' | 'bookings' | 'admin'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [toast, setToast] = useState(null);

  // Booking Flow Steps: null | 'seats' | 'summary' | 'payment' | 'confirmed'
  const [bookingStep, setBookingStep] = useState(null);
  const [bookingData, setBookingData] = useState({
    film: null,
    theaterName: 'Grand Hall',
    timeStr: '11:00 AM',
    seats: [],
    subtotal: 0,
    grandTotal: 0
  });

  // Active confirmed booking object for confirmation screen
  const [latestBooking, setLatestBooking] = useState(null);

  // User confirmed bookings history
  const [userBookings, setUserBookings] = useState([]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    if (userData.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('films');
    }
    showToast(`Signed in successfully as ${userData.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('films');
    setBookingStep(null);
    showToast('Signed out of session');
  };

  // Step 1: Click "Select Seats & Book Tickets" on Movie Details Modal
  const handleStartBookingSeats = (film, theaterName, timeStr) => {
    setSelectedFilm(null);
    setBookingData({
      film,
      theaterName,
      timeStr,
      seats: [],
      subtotal: 0,
      grandTotal: 0
    });
    setBookingStep('seats');
  };

  // Step 2: Click "Continue →" on Seat Selection Grid
  const handleContinueToSummary = (seats, subtotal) => {
    setBookingData(prev => ({
      ...prev,
      seats,
      subtotal
    }));
    setBookingStep('summary');
  };

  // Step 3: Click "Proceed to Payment →" on Order Summary Screen
  const handleProceedToPayment = ({ grandTotal }) => {
    setBookingData(prev => ({
      ...prev,
      grandTotal
    }));
    setBookingStep('payment');
  };

  // Step 4: Click "Pay $X & Confirm" on Payment Screen
  const handleCompletePayment = () => {
    const refCode = 'BKQ3QFB' + Math.floor(1 + Math.random() * 9);
    const newBooking = {
      id: Date.now(),
      bookingRef: refCode,
      film: bookingData.film,
      theaterName: bookingData.theaterName,
      timeStr: bookingData.timeStr,
      seats: bookingData.seats,
      subtotal: bookingData.subtotal,
      totalAmount: bookingData.grandTotal || (bookingData.subtotal * 1.05).toFixed(1),
      date: new Date().toLocaleDateString()
    };

    setLatestBooking(newBooking);
    setUserBookings([newBooking, ...userBookings]);
    setBookingStep('confirmed');
    showToast(`Booking confirmed for ${bookingData.film.title}! Seats: ${bookingData.seats.join(', ')}`);
  };

  const handleCancelBooking = (bookingId) => {
    setUserBookings(userBookings.filter(b => b.id !== bookingId));
    showToast('Ticket cancelled and refund processed.');
  };

  return (
    <div className="app-container">
      {/* Toast Notification Popup */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={20} color="#C89945" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setBookingStep(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {bookingStep === 'seats' && (
          <SeatSelectionScreen
            film={bookingData.film}
            theaterName={bookingData.theaterName}
            timeStr={bookingData.timeStr}
            onBack={() => setBookingStep(null)}
            onContinue={handleContinueToSummary}
          />
        )}

        {bookingStep === 'summary' && (
          <OrderSummaryScreen
            film={bookingData.film}
            theaterName={bookingData.theaterName}
            timeStr={bookingData.timeStr}
            selectedSeats={bookingData.seats}
            subtotal={bookingData.subtotal}
            onBack={() => setBookingStep('seats')}
            onProceed={handleProceedToPayment}
          />
        )}

        {bookingStep === 'payment' && (
          <PaymentScreen
            grandTotal={bookingData.grandTotal}
            user={user}
            onBack={() => setBookingStep('summary')}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {bookingStep === 'confirmed' && (
          <BookingConfirmedScreen
            booking={latestBooking}
            onGoToBookings={() => {
              setBookingStep(null);
              setActiveTab('bookings');
            }}
            onBrowseFilms={() => {
              setBookingStep(null);
              setActiveTab('films');
            }}
          />
        )}

        {!bookingStep && activeTab === 'films' && (
          <FilmsCatalog
            films={films}
            onSelectFilm={(film) => setSelectedFilm(film)}
          />
        )}

        {!bookingStep && activeTab === 'bookings' && (
          <MyBookings
            bookings={userBookings}
            onBrowseClick={() => setActiveTab('films')}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {!bookingStep && activeTab === 'admin' && (
          <AdminDashboard
            films={films}
            setFilms={setFilms}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Movie Details Modal View */}
      {selectedFilm && !bookingStep && (
        <MovieDetailsModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
          onBookSeats={handleStartBookingSeats}
        />
      )}

      {/* Sign In / Register Modal */}
      <SignInModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
