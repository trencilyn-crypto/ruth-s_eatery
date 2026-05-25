import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import BookingModal from './BookingModal';

const Navbar = () => {
  const { data, isUserLoggedIn, currentUser } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8" style={{ color: isScrolled ? data.theme.accentColor : 'white' }} />
          <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            Ruthy <span style={{ color: data.theme.accentColor }}>Eatery</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              style={{ color: isScrolled ? undefined : 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = data.theme.accentColor}
              onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? '' : 'white'}
            >
              {link.name}
            </a>
          ))}
          {isUserLoggedIn ? (
            <div className="flex items-center gap-4">
               {isAdmin && (
                 <Link 
                   to="/admin" 
                   className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${isScrolled ? 'border-amber-600 text-amber-600 bg-amber-50' : 'border-white text-white hover:bg-white/10'}`}
                 >
                   Admin Panel
                 </Link>
               )}
               <Link 
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-amber-500/10 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                title="My Account"
              >
                <div className="p-1.5 bg-amber-500 rounded-full text-white shadow-sm">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold hidden lg:block">{currentUser?.name.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link 
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-amber-500/10 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
               <div className="p-1.5 bg-gray-400 rounded-full text-white shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold hidden lg:block">Login</span>
            </Link>
          )}
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg active:scale-95"
            style={{ backgroundColor: data.theme.accentColor }}
          >
            Book a Table
          </button>
        </div>

        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-xl text-gray-800 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { setIsBookingOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold"
            >
              Book a Table
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
