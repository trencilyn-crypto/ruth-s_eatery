import { useState, useEffect } from 'react';
import { useSiteData, MenuItem } from '../context/SiteContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Type, 
  Utensils, 
  Palette, 
  Phone, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight,
  Home,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Settings as SettingsIcon,
  Upload,
  Edit3,
  Image as LucideImage,
  Mail,
  Check,
  Clock,
  Calendar,
  ShoppingBag,
  MapPin,
  Users,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/Login';

const ImageUploadField = ({ label, value, onChange, presets = [] }: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void,
  presets?: string[]
}) => {
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{label}</label>
        {value && (
          <button 
            onClick={() => setObjectFit(prev => prev === 'cover' ? 'contain' : 'cover')}
            className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 hover:text-amber-700"
          >
            Fit: {objectFit}
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={value.startsWith('data:image') ? 'Uploaded Local Image' : value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                placeholder="Paste image URL here..."
              />
              <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm shrink-0">
              <Upload className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-gray-700">Local File</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {value && (
              <button 
                onClick={() => onChange('')}
                className="p-4 border border-red-100 bg-white text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm"
                title="Remove Photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {presets.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or choose from library</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {presets.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => onChange(p)}
                    className={`flex-none w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${value === p ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={p} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner relative group shrink-0">
          {value ? (
            <>
              <img src={value} alt="Preview" className={`w-full h-full object-${objectFit}`} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase">Current Preview</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <LucideImage className="h-8 w-8 mb-2" />
              <span className="text-[10px] font-bold">No Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { backendService } from '../services/backendService';

const AdminDashboard = () => {
  const { 
    data, 
    updateData, 
    isAdmin, 
    logout, 
    resetToDefault,
    markMessageAsRead,
    deleteMessage,
    updateBookingStatus,
    updateOrderStatus,
    addUser,
    updateUser,
    deleteUser,
    login
  } = useSiteData();
  const [activeTab, setActiveTab] = useState('overview');
  const [dbStatus, setDbStatus] = useState<{ status: string; database?: string }>({ status: 'checking' });

  useEffect(() => {
    const check = async () => {
      const res = await backendService.checkConnection();
      setDbStatus(res);
    };
    check();
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', role: 'user' as 'user' | 'admin' });
  
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<MenuItem>({ name: '', description: '', price: '₱', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' });
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({ 0: true });
  const navigate = useNavigate();

  const openAddUserModal = () => {
    setEditingUserEmail(null);
    setUserFormData({ name: '', email: '', role: 'user' });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: any) => {
    setEditingUserEmail(user.email);
    setUserFormData({ name: user.name, email: user.email, role: user.role });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserEmail) {
      updateUser(editingUserEmail, userFormData);
    } else {
      addUser(userFormData);
    }
    setIsUserModalOpen(false);
  };

  const openAddItemModal = (catIdx: number) => {
    setActiveCategoryIdx(catIdx);
    setNewItem({ 
      name: '', 
      description: '', 
      price: '₱', 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' 
    });
    setIsItemModalOpen(true);
  };

  const handleAddItem = () => {
    if (activeCategoryIdx !== null && newItem.name) {
      const newMenu = [...data.menu];
      newMenu[activeCategoryIdx].items.push(newItem);
      updateData({ menu: newMenu });
      setIsItemModalOpen(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative">
           <Link to="/" className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
             <Home className="h-6 w-6 text-gray-400" />
           </Link>
           <Login />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (section: keyof typeof data, field: string, value: any) => {
    updateData({
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    });
  };

  const handleMenuChange = (catIdx: number, itemIdx: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...data.menu];
    newMenu[catIdx].items[itemIdx][field] = value;
    updateData({ menu: newMenu });
  };



  const addCategory = (type: 'Food' | 'Drinks' | 'Dessert' | 'Appetizers' | 'Other') => {
    const newMenu = [...data.menu];
    const defaultImages = {
      Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      Drinks: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
      Dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
      Appetizers: 'https://images.unsplash.com/photo-1541014741259-df529411b96a?auto=format&fit=crop&w=1200&q=80',
      Other: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    };
    
    newMenu.push({ 
      category: type, 
      description: `Premium selection of ${type.toLowerCase()}.`,
      image: defaultImages[type],
      items: [] 
    });
    updateData({ menu: newMenu });
    setExpandedCategories(prev => ({ ...prev, [newMenu.length - 1]: true }));
  };

  const removeCategory = (catIdx: number) => {
    if (confirm('Delete entire category and all its items?')) {
      const newMenu = [...data.menu];
      newMenu.splice(catIdx, 1);
      updateData({ menu: newMenu });
    }
  };

  const removeMenuItem = (catIdx: number, itemIdx: number) => {
    const newMenu = [...data.menu];
    newMenu[catIdx].items.splice(itemIdx, 1);
    updateData({ menu: newMenu });
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newMenu = [...data.menu];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newMenu.length) {
      [newMenu[index], newMenu[newIndex]] = [newMenu[newIndex], newMenu[index]];
      updateData({ menu: newMenu });
    }
  };

  const moveMenuItem = (catIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    const newMenu = [...data.menu];
    const items = [...newMenu[catIdx].items];
    const newIndex = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[itemIdx], items[newIndex]] = [items[newIndex], items[itemIdx]];
      newMenu[catIdx].items = items;
      updateData({ menu: newMenu });
    }
  };

  const toggleCategory = (idx: number) => {
    setExpandedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className={`font-semibold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="bg-amber-600 p-1.5 rounded-lg">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl">Ruthy <span className="text-amber-600">Portal</span></span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="orders" icon={ShoppingBag} label="Orders" />
          <SidebarItem id="bookings" icon={Calendar} label="Reservations" />
          <SidebarItem id="users" icon={Users} label="User Accounts" />
          <SidebarItem id="messages" icon={Mail} label="Inbox Messages" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Management</div>
          <SidebarItem id="hero" icon={ImageIcon} label="Hero Section" />
          <SidebarItem id="about" icon={Type} label="About Section" />
          <SidebarItem id="menu" icon={Utensils} label="Menu Settings" />
          <SidebarItem id="delivery" icon={SettingsIcon} label="Ordering & Delivery" />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Design & SEO</div>
          <SidebarItem id="theme" icon={Palette} label="Site Branding" />
          <SidebarItem id="contact" icon={Phone} label="Contact Info" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2 text-[10px]">
          <Link to="/" target="_blank" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
            <ExternalLink className="h-5 w-5" />
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>View Live Site</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shrink-0">
          <div>
            <div className="flex items-center text-sm text-gray-400 space-x-2">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              <span className="capitalize">{activeTab}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab} Management</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Live</span>
             </div>
             <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2">
               <Save className="h-4 w-4" /> Save Changes
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'orders' && (
              <div className="space-y-6 pb-20">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-xl">Live Orders</h3>
                      <p className="text-sm text-gray-500">Manage pickup and delivery requests.</p>
                   </div>
                   <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl text-amber-600">
                      Pending: {data.orders.filter(o => o.status === 'pending').length}
                   </div>
                </div>

                <div className="space-y-4">
                  {data.orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100 border-dashed">
                      <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No orders found.</p>
                    </div>
                  ) : (
                    data.orders.map(order => (
                      <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                         <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                  <span className="bg-amber-100 text-amber-800 font-mono font-bold px-3 py-1 rounded-lg">{order.id}</span>
                                  <h4 className="text-xl font-bold text-gray-900">{order.customerName}</h4>
                               </div>
                               <p className="text-gray-400 text-sm font-bold flex items-center gap-2">
                                  <Phone className="h-3 w-3" /> {order.phone} • {order.type.toUpperCase()}
                               </p>
                            </div>
                            <div className="flex items-center gap-3">
                               <select 
                                 value={order.status}
                                 onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                 className="bg-gray-50 border-none rounded-xl font-bold text-sm px-4 py-2"
                               >
                                  <option value="pending">Pending</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                               </select>
                            </div>
                         </div>

                         {order.address && (
                           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-3">
                              <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-1" />
                              <p className="text-gray-700 leading-relaxed font-medium">{order.address}</p>
                           </div>
                         )}

                         <div className="space-y-3 pt-4 border-t border-gray-100">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</h5>
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                 <span className="text-gray-600 font-medium">1x {item.name}</span>
                                 <span className="font-mono text-gray-400">{item.price}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                               <span className="font-bold text-gray-900">Total Revenue</span>
                               <span className="text-xl font-bold text-amber-600">₱{order.total.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6 pb-20">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-xl">User Accounts</h3>
                      <p className="text-sm text-gray-500">Create, edit, and manage restaurant staff and customers.</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="hidden md:flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl text-amber-600">
                        Total: {data.users.length}
                      </div>
                      <button 
                        onClick={openAddUserModal}
                        className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                      >
                        <Plus className="h-4 w-4" /> Add User
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                         <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                            <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activity</th>
                            <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered</th>
                            <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {data.users.map((user, i) => (
                           <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                                       {user.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-gray-900">{user.name}</p>
                                       <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                   user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                 }`}>
                                    {user.role}
                                 </span>
                              </td>
                              <td className="p-6">
                                 <div className="space-y-1">
                                    <p className="text-xs text-gray-600 font-medium">Orders: {data.orders.filter(o => o.userId === user.email).length}</p>
                                    <p className="text-xs text-gray-600 font-medium">Bookings: {data.bookings.filter(b => b.userId === user.email).length}</p>
                                 </div>
                              </td>
                              <td className="p-6 text-xs text-gray-400">
                                 {new Date(user.registeredAt).toLocaleDateString()}
                              </td>
                              <td className="p-6">
                                 <div className="flex items-center justify-end gap-2">
                                    {user.role !== 'admin' && (
                                      <button 
                                        onClick={() => {
                                          if(confirm(`Login as ${user.name}? You will be redirected to the customer dashboard.`)) {
                                            login(user.email, 'bypass', user.name);
                                            navigate('/dashboard');
                                          }
                                        }}
                                        className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all"
                                        title="Login As"
                                      >
                                         <UserCheck className="h-4 w-4" />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => openEditUserModal(user)}
                                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                      title="Edit User"
                                    >
                                       <Edit3 className="h-4 w-4" />
                                    </button>
                                    {user.email !== 'admin@gmail.com' && (
                                      <button 
                                        onClick={() => { if(confirm('Permanently delete this user account?')) deleteUser(user.email); }}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                                        title="Delete User"
                                      >
                                         <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6 pb-20">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-xl">Reservations</h3>
                      <p className="text-sm text-gray-500">Manage table bookings and guest attendance.</p>
                   </div>
                   <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl text-amber-600">
                      Total Bookings: {data.bookings.length}
                   </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                   {data.bookings.length === 0 ? (
                     <div className="col-span-2 bg-white p-20 rounded-[3rem] text-center border border-gray-100">
                        <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No reservations found.</p>
                     </div>
                   ) : (
                     data.bookings.map(booking => (
                       <div key={booking.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-full h-1 ${
                            booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'cancelled' ? 'bg-red-400' : 'bg-amber-400'
                          }`} />
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-xl font-bold text-gray-900">{booking.name}</h4>
                                <p className="text-amber-600 font-bold text-sm">{booking.guests} Guests</p>
                             </div>
                             <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">{booking.id}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">{booking.date}</span>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">{booking.time}</span>
                             </div>
                          </div>

                          <div className="flex items-center gap-3">
                             <Phone className="h-4 w-4 text-gray-400" />
                             <span className="text-sm text-gray-500">{booking.phone}</span>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex gap-3">
                             {booking.status === 'pending' && (
                               <button 
                                 onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                 className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-600 transition-colors"
                               >
                                 Confirm
                               </button>
                             )}
                             <button 
                               onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                               className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-sm hover:bg-red-50 hover:text-red-500 transition-all"
                             >
                               Cancel
                             </button>
                          </div>
                       </div>
                     ))
                   )}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-xl">Inbox Messages</h3>
                      <p className="text-sm text-gray-500">View and manage inquiries from your contact form.</p>
                   </div>
                   <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl">
                      <span>Total: {data.messages.length}</span>
                      <span className="text-amber-600">Unread: {data.messages.filter(m => !m.isRead).length}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  {data.messages.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100 border-dashed">
                      <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Mail className="h-10 w-10" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">No messages yet</h4>
                      <p className="text-gray-500 mt-1">Incoming inquiries will appear here.</p>
                    </div>
                  ) : (
                    data.messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`bg-white border-2 rounded-[2.5rem] p-8 transition-all relative overflow-hidden group ${msg.isRead ? 'border-gray-50 opacity-80' : 'border-amber-100 shadow-xl'}`}
                      >
                        {!msg.isRead && (
                          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
                        )}
                        
                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1 space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <div>
                                    <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                       {msg.subject}
                                       {!msg.isRead && <span className="bg-amber-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">New</span>}
                                    </h4>
                                    <p className="text-amber-600 font-bold text-sm">From: {msg.name} ({msg.email})</p>
                                 </div>
                                 <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Clock className="h-3.5 w-3.5" />
                                    {msg.date}
                                 </div>
                              </div>
                              <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 italic leading-relaxed text-lg border-l-4 border-gray-200">
                                 "{msg.message}"
                              </div>
                           </div>
                           
                           <div className="flex md:flex-col gap-3 justify-end">
                              {!msg.isRead && (
                                <button 
                                  onClick={() => markMessageAsRead(msg.id)}
                                  className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-600 transition-colors"
                                >
                                  <Check className="h-4 w-4" /> Mark Read
                                </button>
                              )}
                              <button 
                                onClick={() => { if(confirm('Delete this message?')) deleteMessage(msg.id); }}
                                className="flex items-center justify-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all border border-red-100"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="col-span-2 bg-gradient-to-r from-amber-600 to-amber-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-600/10 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Welcome, Ruthy Admin</h2>
                    <p className="opacity-90 max-w-md">Your restaurant's digital presence is looking great. All changes you make here will be reflected on your website instantly.</p>
                  </div>
                  <button 
                    onClick={() => { if(confirm('Reset website to original default content?')) resetToDefault(); }}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Reset Content
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Menu Items</p>
                         <p className="text-3xl font-bold text-amber-600">{data.menu.reduce((acc, cat) => acc + cat.items.length, 0)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Categories</p>
                         <p className="text-3xl font-bold text-amber-600">{data.menu.length}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Inbox</p>
                         <p className="text-3xl font-bold text-amber-600">{data.messages.length}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs font-bold text-gray-400 uppercase">Unread</p>
                         <p className="text-3xl font-bold text-amber-600">{data.messages.filter(m => !m.isRead).length}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">Cloud Connectivity</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Backend API</span>
                         <span className={`font-bold ${dbStatus.status === 'connected' ? 'text-green-600' : dbStatus.status === 'offline' ? 'text-red-500' : 'text-amber-500'}`}>
                            {dbStatus.status.toUpperCase()}
                         </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Aiven DB Sync</span>
                         <span className={`font-bold ${dbStatus.status === 'connected' ? 'text-green-600' : 'text-gray-300'}`}>
                            {dbStatus.status === 'connected' ? 'ACTIVE' : 'WAITING'}
                         </span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                         <span className="text-gray-500">Sync Mode</span>
                         <span className="text-amber-600 font-bold text-[10px] uppercase">
                            {dbStatus.status === 'connected' ? 'Cloud Native' : 'Local Fallback'}
                         </span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                 <div className="grid gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-900">
                         <Type className="h-5 w-5 text-amber-600" />
                         <h3 className="font-bold">Hero Text Content</h3>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Headline</label>
                          <textarea
                            value={data.hero.title}
                            onChange={(e) => handleChange('hero', 'title', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px] text-lg font-serif"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subtext / Description</label>
                          <textarea
                            value={data.hero.subtitle}
                            onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[120px] text-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-900 mb-6">
                         <ImageIcon className="h-5 w-5 text-amber-600" />
                         <h3 className="font-bold">Visual Background</h3>
                      </div>
                      <ImageUploadField 
                        label="Hero Background Image"
                        value={data.hero.bgImage}
                        onChange={(val) => handleChange('hero', 'bgImage', val)}
                        presets={[
                          '/images/hero-eatery.jpg',
                          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
                        ]}
                      />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                       <Edit3 className="h-5 w-5 text-amber-600" />
                       <h3 className="font-bold">About Content</h3>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Label</label>
                          <input
                            type="text"
                            value={data.about.title}
                            onChange={(e) => handleChange('about', 'title', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Headline</label>
                          <input
                            type="text"
                            value={data.about.subtitle}
                            onChange={(e) => handleChange('about', 'subtitle', e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-serif text-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed Story</label>
                        <textarea
                          value={data.about.description}
                          onChange={(e) => handleChange('about', 'description', e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[150px] text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-900 mb-6">
                       <LucideImage className="h-5 w-5 text-amber-600" />
                       <h3 className="font-bold">Feature Image</h3>
                    </div>
                    <ImageUploadField 
                      label="Restaurant Signature Photo"
                      value={data.about.image}
                      onChange={(val) => handleChange('about', 'image', val)}
                      presets={[
                        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1550966841-3ee7adac1668?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80'
                      ]}
                    />
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 text-gray-900">
                       <Type className="h-5 w-5 text-amber-600" />
                       <h3 className="font-bold">Our Story Settings</h3>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Title</label>
                        <input
                          type="text"
                          value={data.about.storyTitle}
                          onChange={(e) => handleChange('about', 'storyTitle', e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Content</label>
                        <textarea
                          value={data.about.storyContent}
                          onChange={(e) => handleChange('about', 'storyContent', e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[150px] text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-8 pb-12">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-1 text-center md:text-left">
                      <h3 className="font-bold text-gray-900 text-2xl">Menu Sections</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         Connected to Node.js Backend
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          const allOpen = Object.values(expandedCategories).every(v => v);
                          const nextState: Record<number, boolean> = {};
                          data.menu.forEach((_, i) => nextState[i] = !allOpen);
                          setExpandedCategories(nextState);
                        }}
                        className="bg-gray-100 text-gray-700 px-6 py-5 rounded-[1.5rem] font-bold text-sm hover:bg-gray-200 transition-all"
                      >
                         Toggle All
                      </button>
                      <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                      >
                        <Plus className="h-6 w-6" />
                        <span>New Category</span>
                      </button>
                   </div>
                </div>

                {/* Category Selection Modal */}
                <AnimatePresence>
                  {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCategoryModalOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
                      >
                         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                               <h3 className="text-3xl font-serif font-bold text-gray-900">Add Section</h3>
                               <p className="text-sm text-gray-500">Pick a starting template</p>
                            </div>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                               <X className="h-6 w-6" />
                            </button>
                         </div>
                         <div className="p-8 grid grid-cols-2 gap-6">
                            {(['Food', 'Drinks', 'Dessert', 'Appetizers', 'Other'] as const).map(type => (
                              <button 
                                key={type}
                                onClick={() => {
                                  addCategory(type);
                                  setIsCategoryModalOpen(false);
                                }}
                                className="group flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-gray-50 hover:border-amber-600 hover:bg-amber-50 transition-all text-center"
                              >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  {type === 'Food' && <Utensils className="h-8 w-8 text-amber-600" />}
                                  {type === 'Drinks' && <Phone className="h-8 w-8 text-blue-500" />}
                                  {type === 'Dessert' && <Palette className="h-8 w-8 text-pink-500" />}
                                  {type === 'Appetizers' && <LayoutDashboard className="h-8 w-8 text-green-500" />}
                                  {type === 'Other' && <Plus className="h-8 w-8 text-gray-400" />}
                                </div>
                                <span className="font-bold text-gray-900 text-lg">{type}</span>
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {data.menu.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
                    <div className={`p-6 bg-gray-50 flex items-center justify-between cursor-pointer group ${expandedCategories[catIdx] ? 'border-b border-gray-100' : ''}`}
                         onClick={() => toggleCategory(catIdx)}>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-lg border-4 border-white group-hover:scale-110 transition-transform shrink-0">
                             <img src={cat.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                             <input
                               type="text"
                               value={cat.category}
                               onClick={(e) => e.stopPropagation()}
                               onChange={(e) => {
                                 const newMenu = [...data.menu];
                                 newMenu[catIdx].category = e.target.value;
                                 updateData({ menu: newMenu });
                               }}
                               className="font-bold text-2xl bg-transparent border-none focus:ring-0 p-0 hover:text-amber-600 transition-colors"
                             />
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat.items.length} dishes total</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                            <button onClick={() => moveCategory(catIdx, 'up')} className="p-3 hover:bg-gray-50 text-gray-400 disabled:opacity-20 border-r border-gray-100" disabled={catIdx === 0}>
                              <ChevronUp className="h-6 w-6" />
                            </button>
                            <button onClick={() => moveCategory(catIdx, 'down')} className="p-3 hover:bg-gray-50 text-gray-400 disabled:opacity-20" disabled={catIdx === data.menu.length - 1}>
                              <ChevronDown className="h-6 w-6" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleCategory(catIdx)}
                            className={`p-3 rounded-full hover:bg-gray-200 transition-transform duration-300 ${expandedCategories[catIdx] ? 'rotate-180' : ''}`}
                          >
                             <ChevronDown className="h-7 w-7 text-gray-400" />
                          </button>
                       </div>
                    </div>

                    <AnimatePresence>
                      {expandedCategories[catIdx] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 space-y-12">
                             <div className="flex justify-between items-start pb-8 border-b border-gray-100">
                                <div className="space-y-6 flex-1">
                                   <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Section Customization</h4>
                                      <button 
                                        onClick={() => removeCategory(catIdx)}
                                        className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                      </button>
                                   </div>
                                   <div className="grid lg:grid-cols-2 gap-10 items-start">
                                      <div className="space-y-6">
                                         <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50 shadow-sm">
                                            <label className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-3">Section Branding</label>
                                            <textarea
                                              value={cat.description}
                                              onChange={(e) => {
                                                const newMenu = [...data.menu];
                                                newMenu[catIdx].description = e.target.value;
                                                updateData({ menu: newMenu });
                                              }}
                                              className="w-full p-5 border-none rounded-2xl bg-white text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all leading-relaxed shadow-sm min-h-[140px]"
                                              placeholder="Describe the vibe of this category..."
                                              rows={4}
                                            />
                                         </div>
                                      </div>
                                      <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 shadow-sm">
                                         <ImageUploadField 
                                            label="Section Banner Photo"
                                            value={cat.image || ''}
                                            onChange={(val) => {
                                              const newMenu = [...data.menu];
                                              newMenu[catIdx].image = val;
                                              updateData({ menu: newMenu });
                                            }}
                                            presets={[
                                              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
                                              'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
                                              'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'
                                            ]}
                                         />
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                   <h4 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Dishes & Drinks</h4>
                                   <button 
                                      onClick={() => openAddItemModal(catIdx)}
                                      className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
                                    >
                                      <Plus className="h-5 w-5" /> Add New Item
                                    </button>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                   {cat.items.map((item, itemIdx) => (
                                     <div key={itemIdx} className="bg-white border border-gray-100 rounded-[3rem] p-6 hover:shadow-2xl hover:border-amber-200 transition-all group relative">
                                        <div className="absolute top-6 right-8 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                           <div className="flex bg-white/90 backdrop-blur shadow-sm rounded-xl overflow-hidden border border-gray-100">
                                              <button onClick={() => moveMenuItem(catIdx, itemIdx, 'up')} className="p-2 text-gray-400 hover:text-amber-600 disabled:opacity-10" disabled={itemIdx === 0}>
                                                <ChevronUp className="h-4 w-4" />
                                              </button>
                                              <button onClick={() => moveMenuItem(catIdx, itemIdx, 'down')} className="p-2 text-gray-400 hover:text-amber-600 disabled:opacity-10 border-l border-gray-50" disabled={itemIdx === cat.items.length - 1}>
                                                <ChevronDown className="h-4 w-4" />
                                              </button>
                                           </div>
                                           <button 
                                              onClick={() => removeMenuItem(catIdx, itemIdx)} 
                                              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                             <Trash2 className="h-4 w-4" />
                                           </button>
                                        </div>
                                        
                                        <div className="space-y-6">
                                           <div className="h-48 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner group-hover:shadow-md transition-shadow">
                                              <ImageUploadField 
                                                 label=""
                                                 value={item.image}
                                                 onChange={(val) => handleMenuChange(catIdx, itemIdx, 'image', val)}
                                              />
                                           </div>

                                           <div className="space-y-4 px-2">
                                              <div className="flex gap-4">
                                                 <div className="flex-1 space-y-1">
                                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Item Name</label>
                                                    <input 
                                                      type="text" 
                                                      value={item.name} 
                                                      onChange={(e) => handleMenuChange(catIdx, itemIdx, 'name', e.target.value)}
                                                      className="w-full font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 text-xl" 
                                                    />
                                                 </div>
                                                 <div className="w-24 space-y-1">
                                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price</label>
                                                    <input 
                                                      type="text" 
                                                      value={item.price} 
                                                      onChange={(e) => handleMenuChange(catIdx, itemIdx, 'price', e.target.value)}
                                                      className="w-full font-mono text-amber-600 font-bold bg-amber-50 rounded-lg px-2 py-1 border-none focus:ring-0 text-right" 
                                                    />
                                                 </div>
                                              </div>
                                              <div className="space-y-1">
                                                 <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                                 <textarea 
                                                   value={item.description} 
                                                   onChange={(e) => handleMenuChange(catIdx, itemIdx, 'description', e.target.value)}
                                                   className="w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 min-h-[60px] leading-relaxed resize-none" 
                                                   placeholder="Describe this dish..."
                                                 />
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Background Color</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.bgColor} 
                        onChange={(e) => handleChange('theme', 'bgColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.bgColor} 
                        onChange={(e) => handleChange('theme', 'bgColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Accent Color (Buttons, Icons)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.accentColor} 
                        onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.accentColor} 
                        onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Text Primary Color</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={data.theme.textColor} 
                        onChange={(e) => handleChange('theme', 'textColor', e.target.value)}
                        className="h-16 w-16 rounded-xl cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={data.theme.textColor} 
                        onChange={(e) => handleChange('theme', 'textColor', e.target.value)}
                        className="flex-1 p-4 border border-gray-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Phone</label>
                    <input
                      type="text"
                      value={data.contact.phone}
                      onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Email</label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) => handleChange('contact', 'email', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Address</label>
                    <textarea
                      value={data.contact.address}
                      onChange={(e) => handleChange('contact', 'address', e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 uppercase">Enable Delivery</label>
                      <button 
                        onClick={() => handleChange('settings', 'deliveryEnabled', !data.settings.deliveryEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.settings.deliveryEnabled ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.deliveryEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-700 uppercase">Enable Pickup</label>
                      <button 
                        onClick={() => handleChange('settings', 'pickupEnabled', !data.settings.pickupEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.settings.pickupEnabled ? 'bg-amber-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.pickupEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Delivery Fee</label>
                      <input 
                        type="text" 
                        value={data.settings.deliveryFee}
                        onChange={(e) => handleChange('settings', 'deliveryFee', e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Min. Order Value</label>
                      <input 
                        type="text" 
                        value={data.settings.minOrder}
                        onChange={(e) => handleChange('settings', 'minOrder', e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Add/Edit Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden"
            >
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                     <h3 className="text-2xl font-serif font-bold text-gray-900">{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
                     <p className="text-sm text-gray-500">Manage account credentials and roles</p>
                  </div>
                  <button onClick={() => setIsUserModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                     <X className="h-6 w-6" />
                  </button>
               </div>
               
               <form onSubmit={handleUserSubmit} className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={userFormData.name} 
                      onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                      className="w-full font-bold text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" 
                      placeholder="e.g. Maria Clara"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      disabled={!!editingUserEmail}
                      value={userFormData.email} 
                      onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                      className={`w-full font-bold text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all ${editingUserEmail ? 'bg-gray-100 opacity-60' : 'focus:ring-2 focus:ring-amber-500/20'}`} 
                      placeholder="email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Account Role</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                        type="button"
                        onClick={() => setUserFormData({...userFormData, role: 'user'})}
                        className={`py-3 rounded-xl border-2 font-bold transition-all ${userFormData.role === 'user' ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-50 text-gray-400'}`}
                       >
                         User/Customer
                       </button>
                       <button 
                        type="button"
                        onClick={() => setUserFormData({...userFormData, role: 'admin'})}
                        className={`py-3 rounded-xl border-2 font-bold transition-all ${userFormData.role === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-50 text-gray-400'}`}
                       >
                         Administrator
                       </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gray-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-gray-800 shadow-xl transition-all"
                  >
                    {editingUserEmail ? 'Save Changes' : 'Create Account'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Addition Modal (Process-driven) */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsItemModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                     <h3 className="text-2xl font-serif font-bold text-gray-900">Add New Dish/Drink</h3>
                     <p className="text-sm text-gray-500">Add this to the <span className="font-bold text-amber-600">{data.menu[activeCategoryIdx || 0].category}</span> section</p>
                  </div>
                  <button onClick={() => setIsItemModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                     <X className="h-6 w-6" />
                  </button>
               </div>
               
               <div className="p-10 space-y-8">
                  <ImageUploadField 
                    label="Item Photo"
                    value={newItem.image}
                    onChange={(val) => setNewItem({...newItem, image: val})}
                  />

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="col-span-3 space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name of Dish</label>
                       <input 
                         type="text" 
                         value={newItem.name} 
                         onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                         className="w-full font-bold text-gray-900 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-lg" 
                         placeholder="E.g. Garlic Butter Shrimp"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (₱)</label>
                       <input 
                         type="text" 
                         value={newItem.price} 
                         onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                         className="w-full font-mono text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 outline-none text-lg" 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                     <textarea 
                       value={newItem.description} 
                       onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                       className="w-full text-base text-gray-600 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 outline-none min-h-[120px] leading-relaxed" 
                       placeholder="What makes this dish special?"
                     />
                  </div>

                  <button 
                    onClick={handleAddItem}
                    disabled={!newItem.name}
                    className="w-full bg-gray-900 text-white font-bold py-5 rounded-[1.5rem] hover:bg-gray-800 shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Complete Addition</span>
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
