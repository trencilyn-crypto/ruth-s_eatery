import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, CheckCircle, ChevronRight } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import AuthModal from './AuthModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { addBooking, isUserLoggedIn, currentUser } = useSiteData();
  const [step, setStep] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });

  useEffect(() => {
    if (isUserLoggedIn && currentUser) {
      setFormData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
    }
  }, [isUserLoggedIn, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    addBooking({
      ...formData,
      userId: currentUser!.email
    });
    setStep(3);
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <>
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-3xl font-serif font-bold text-gray-900">Book a Table</h3>
                <p className="text-gray-500 mt-1">Experience Ruthy Eatery's hospitality</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 md:p-12">
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Preferred Time
                      </label>
                      <select
                        className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                      >
                        <option value="">Select a time</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:30 PM">12:30 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:30 PM">07:30 PM</option>
                        <option value="09:00 PM">09:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Users className="h-3 w-3" /> Number of Guests
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 4, 6, 8].map(num => (
                        <button
                          key={num}
                          onClick={() => setFormData({ ...formData, guests: num })}
                          className={`py-4 rounded-xl border-2 font-bold transition-all ${
                            formData.guests === num ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-50 text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {num === 8 ? '8+' : num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={!formData.date || !formData.time}
                    className="w-full bg-gray-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Continue to Details</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <input
                      required
                      placeholder="Full Name"
                      className="w-full p-5 border border-gray-100 rounded-[1.25rem] bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-5 border border-gray-100 rounded-[1.25rem] bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full p-5 border border-gray-100 rounded-[1.25rem] bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <div className="flex justify-between items-center text-sm font-bold text-amber-800 mb-2">
                       <span>Reservation Summary</span>
                       <button type="button" onClick={() => setStep(1)} className="underline">Change</button>
                    </div>
                    <div className="text-amber-700 text-sm opacity-80">
                      {formData.date} at {formData.time} • {formData.guests} Guests
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 text-white font-bold py-5 rounded-[1.5rem] hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20"
                  >
                    Confirm Reservation
                  </button>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif font-bold text-gray-900">Table Reserved!</h4>
                    <p className="text-gray-500 max-w-xs mx-auto">We've sent a confirmation email to {formData.email}. See you soon!</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-left max-w-sm mx-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Reservation Details</div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Guest</span>
                        <span className="font-bold text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date</span>
                        <span className="font-bold text-gray-900">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time</span>
                        <span className="font-bold text-gray-900">{formData.time}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full border-2 border-gray-900 text-gray-900 font-bold py-5 rounded-[1.5rem] hover:bg-gray-50 transition-all"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default BookingModal;
