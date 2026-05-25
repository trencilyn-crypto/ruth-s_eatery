import { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { ShoppingBag, Calendar, User, Package, ChevronRight, Home, LogOut, Clock, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const UserDashboard = () => {
  const { data, isUserLoggedIn, currentUser, logout } = useSiteData();
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect to Admin if user is admin
  useEffect(() => {
    if (isUserLoggedIn && currentUser?.role === 'admin') {
      navigate('/admin');
    }
  }, [isUserLoggedIn, currentUser, navigate]);

  // Filter global state for this specific user
  const userOrders = data.orders.filter(o => o.userId === currentUser?.email);
  const userBookings = data.bookings.filter(b => b.userId === currentUser?.email);

  if (!isUserLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md border border-gray-100">
           <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-amber-600" />
           </div>
           <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your Dashboard</h2>
           <p className="text-gray-500 mb-10 leading-relaxed">Please login to view your order history and manage your table reservations.</p>
           <div className="space-y-4">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full bg-gray-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-gray-800 transition-all shadow-xl"
              >
                Sign In / Sign Up
              </button>
              <Link to="/" className="block w-full py-4 text-gray-400 font-bold hover:text-amber-600 transition-colors">
                Back to Home
              </Link>
           </div>
        </div>
      </div>
    );
  }

  const user = currentUser;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <aside className="md:w-1/3 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                 <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                    <User className="h-10 w-10 text-amber-600" />
                 </div>
                 <h2 className="text-2xl font-serif font-bold text-gray-900">{user.name}</h2>
                 <p className="text-gray-400 text-sm">{user.email}</p>
                 <button 
                  onClick={logout}
                  className="mt-8 w-full py-4 border-2 border-gray-100 rounded-2xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                 >
                    <LogOut className="h-4 w-4" /> Sign Out
                 </button>
              </div>

              <nav className="space-y-3">
                 <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                 >
                    <div className="flex items-center gap-4">
                       <Package className="h-5 w-5" />
                       <span>My Orders</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                 </button>
                 <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] font-bold transition-all ${activeTab === 'bookings' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                 >
                    <div className="flex items-center gap-4">
                       <Calendar className="h-5 w-5" />
                       <span>My Bookings</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                 </button>
                 <Link to="/" className="w-full flex items-center justify-between p-6 rounded-[1.5rem] font-bold bg-white text-gray-500 hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-4">
                       <Home className="h-5 w-5" />
                       <span>Back to Site</span>
                    </div>
                 </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
               {activeTab === 'orders' && (
                 <div className="space-y-6">
                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8">Order History</h3>
                    {userOrders.length === 0 ? (
                      <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100">
                         <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-10 w-10 text-gray-300" />
                         </div>
                         <h4 className="text-xl font-bold text-gray-900">No orders yet</h4>
                         <p className="text-gray-500 mt-1">Ready to taste something delicious?</p>
                         <Link to="/" className="inline-block mt-8 bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
                            Explore Menu
                         </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {userOrders.map(order => (
                           <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-3">
                                    <span className="bg-amber-50 text-amber-600 font-mono font-bold px-3 py-1 rounded-lg text-sm">{order.id}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                      order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                      {order.status}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                    {order.type === 'delivery' && <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery</span>}
                                 </div>
                                 <div className="flex gap-2 flex-wrap">
                                    {order.items.slice(0, 3).map((item, i) => (
                                      <span key={i} className="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-600">{item.name}</span>
                                    ))}
                                    {order.items.length > 3 && <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>}
                                 </div>
                              </div>
                              <div className="text-right flex flex-col justify-between">
                                 <p className="text-2xl font-bold text-gray-900">₱{order.total.toLocaleString()}</p>
                                 <button className="text-amber-600 font-bold text-xs uppercase tracking-widest hover:underline">View Receipt</button>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'bookings' && (
                 <div className="space-y-6">
                    <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8">Table Reservations</h3>
                    {userBookings.length === 0 ? (
                      <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100">
                         <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="h-10 w-10 text-gray-300" />
                         </div>
                         <h4 className="text-xl font-bold text-gray-900">No reservations</h4>
                         <p className="text-gray-500 mt-1">Book a table for your next visit.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         {userBookings.map(booking => (
                           <div key={booking.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
                                    <Calendar className="h-8 w-8" />
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900">{booking.date} at {booking.time}</h4>
                                    <p className="text-gray-400 text-sm">{booking.guests} Guests • {booking.status}</p>
                                 </div>
                              </div>
                              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {booking.status}
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
