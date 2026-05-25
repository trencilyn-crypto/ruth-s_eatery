import React, { createContext, useContext, useState, useEffect } from 'react';
import { backendService } from '../services/backendService';

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface MenuCategory {
  category: string;
  description?: string;
  image?: string;
  items: MenuItem[];
}

export interface SiteMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface SiteBooking {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface SiteOrder {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  type: 'pickup' | 'delivery';
  address?: string;
  items: MenuItem[];
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SiteUser {
  name: string;
  email: string;
  role: 'admin' | 'user';
  registeredAt: string;
}

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    storyTitle: string;
    storyContent: string;
  };
  menu: MenuCategory[];
  theme: {
    bgColor: string;
    accentColor: string;
    textColor: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  settings: {
    deliveryEnabled: boolean;
    pickupEnabled: boolean;
    deliveryFee: string;
    minOrder: string;
  };
  messages: SiteMessage[];
  bookings: SiteBooking[];
  orders: SiteOrder[];
  users: SiteUser[];
}

const defaultData: SiteData = {
  hero: {
    title: 'Experience the Art of Fine Dining',
    subtitle: 'From locally sourced ingredients to masterfully crafted recipes, Ruthy Eatery offers a culinary journey you won\'t forget.',
    bgImage: '/images/hero-eatery.jpg',
  },
  about: {
    title: 'About Us',
    subtitle: 'A Legacy of Flavor and Passion',
    description: 'Founded in 2015, Ruthy Eatery began with a simple mission: to bring honest, high-quality food to our community. Every dish we serve is a testament to our dedication to fresh ingredients and traditional techniques with a modern twist.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    storyTitle: 'Our Culinary Journey',
    storyContent: 'Our story started in a small kitchen with a big dream. We believe that great food comes from the heart, and every recipe we share is a piece of our heritage. From the first sizzle of the pan to the final garnish, we pour our passion into every plate. Join us as we continue to write our flavorful story, one guest at a time.',
  },
  menu: [
    {
      category: 'Food',
      description: 'Hearty main courses prepared with the finest locally sourced ingredients.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Grilled Ribeye', description: '12oz grass-fed beef with garlic herb butter.', price: '₱1,850', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80' },
        { name: 'Pan-Seared Salmon', description: 'Wild-caught salmon with asparagus and lemon risotto.', price: '₱950', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80' },
        { name: 'Herb Roasted Chicken', description: 'Free-range chicken with root vegetables and pan jus.', price: '₱720', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      category: 'Drinks',
      description: 'Craft cocktails, artisanal spirits, and a curated selection of fine wines.',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Signature Old Fashioned', description: 'Bourbon, house-made bitters, orange peel.', price: '₱450', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
        { name: 'Elderflower Spritz', description: 'Gin, elderflower liqueur, prosecco, soda.', price: '₱480', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' },
        { name: 'Artisan Espresso Martini', description: 'Fresh espresso, vodka, coffee liqueur.', price: '₱420', image: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      category: 'Desserts',
      description: 'Exquisite sweet endings handcrafted by our pastry chef daily.',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
      items: [
        { name: 'Lava Cake', description: 'Warm chocolate center with vanilla bean gelato.', price: '₱350', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80' },
        { name: 'Lemon Tart', description: 'Shortbread crust with zesty lemon curd and berries.', price: '₱280', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400&q=80' },
        { name: 'Tiramisu', description: 'Classic Italian style with espresso-soaked ladyfingers.', price: '₱320', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80' },
      ]
    }
  ],
  theme: {
    bgColor: '#ffffff',
    accentColor: '#d97706',
    textColor: '#111827',
  },
  contact: {
    phone: '(02) 8123-4567',
    email: 'hello@ruthyeatery.com',
    address: '123 Makati Avenue, Makati City, Metro Manila',
  },
  settings: {
    deliveryEnabled: true,
    pickupEnabled: true,
    deliveryFee: '₱50.00',
    minOrder: '₱500.00',
  },
  messages: [],
  bookings: [],
  orders: [],
  users: [
    { name: 'Super Admin', email: 'admin@gmail.com', role: 'admin', registeredAt: new Date().toISOString() }
  ]
};

interface SiteContextType {
  data: SiteData;
  isLoading: boolean;
  updateData: (newData: Partial<SiteData>) => void;
  addMessage: (message: Omit<SiteMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  addBooking: (booking: Omit<SiteBooking, 'id' | 'status' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: SiteBooking['status']) => void;
  addOrder: (order: Omit<SiteOrder, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: SiteOrder['status']) => void;
  addUser: (user: Omit<SiteUser, 'registeredAt'>) => void;
  updateUser: (email: string, updates: Partial<SiteUser>) => void;
  deleteUser: (email: string) => void;
  isAdmin: boolean;
  isUserLoggedIn: boolean;
  currentUser: { name: string; email: string; role: 'admin' | 'user' } | null;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  resetToDefault: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'admin' | 'user' } | null>(() => {
    const saved = localStorage.getItem('ruthy_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = currentUser?.role === 'admin';
  const isUserLoggedIn = !!currentUser;

  // Fetch from "Backend" on mount
  useEffect(() => {
    const init = async () => {
      const remoteData = await backendService.getSiteData();
      if (remoteData) {
        setData(remoteData as SiteData);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const updateData = async (newData: Partial<SiteData>) => {
    const updated = { ...data, ...newData } as SiteData;
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const addMessage = async (msg: Omit<SiteMessage, 'id' | 'date' | 'isRead'>) => {
    const newMessage: SiteMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      isRead: false
    };
    const updated = { ...data, messages: [newMessage, ...data.messages] };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const markMessageAsRead = async (id: string) => {
    const updatedMessages = data.messages.map(m => 
      m.id === id ? { ...m, isRead: true } : m
    );
    const updated = { ...data, messages: updatedMessages };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const deleteMessage = async (id: string) => {
    const updatedMessages = data.messages.filter(m => m.id !== id);
    const updated = { ...data, messages: updatedMessages };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const addBooking = async (booking: Omit<SiteBooking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: SiteBooking = {
      ...booking,
      id: 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = { ...data, bookings: [newBooking, ...data.bookings] };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const updateBookingStatus = async (id: string, status: SiteBooking['status']) => {
    const updatedBookings = data.bookings.map(b => b.id === id ? { ...b, status } : b);
    const updated = { ...data, bookings: updatedBookings };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const addOrder = async (order: Omit<SiteOrder, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: SiteOrder = {
      ...order,
      id: 'OR-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = { ...data, orders: [newOrder, ...data.orders] };
    setData(updated);
    await backendService.saveSiteData(updated);
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: SiteOrder['status']) => {
    const updatedOrders = data.orders.map(o => o.id === id ? { ...o, status } : o);
    const updated = { ...data, orders: updatedOrders };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const addUser = async (user: Omit<SiteUser, 'registeredAt'>) => {
    const newUser: SiteUser = {
      ...user,
      registeredAt: new Date().toISOString()
    };
    const updated = { ...data, users: [...data.users, newUser] };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const updateUser = async (email: string, updates: Partial<SiteUser>) => {
    const updatedUsers = data.users.map(u => u.email === email ? { ...u, ...updates } : u);
    const updated = { ...data, users: updatedUsers };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const deleteUser = async (email: string) => {
    if (email === 'admin@gmail.com') return; // Prevent deleting the main admin
    const updatedUsers = data.users.filter(u => u.email !== email);
    const updated = { ...data, users: updatedUsers };
    setData(updated);
    await backendService.saveSiteData(updated);
  };

  const login = (email: string, password: string, name?: string) => {
    let user: { name: string; email: string; role: 'admin' | 'user' } | null = null;

    if (email === 'admin@gmail.com' && password === 'admin123') {
      user = { name: 'Super Admin', email: 'admin@gmail.com', role: 'admin' };
    } else if (password) {
      user = { name: name || 'Valued Guest', email, role: 'user' };
      
      // Register user if not already in list
      const userExists = data.users.find(u => u.email === email);
      if (!userExists) {
        const newUser: SiteUser = {
          name: user.name,
          email: user.email,
          role: 'user',
          registeredAt: new Date().toISOString()
        };
        const updated = { ...data, users: [...data.users, newUser] };
        setData(updated);
        backendService.saveSiteData(updated);
      }
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('ruthy_session_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ruthy_session_user');
  };

  const resetToDefault = () => {
    setData(defaultData);
  };

  return (
    <SiteContext.Provider value={{ 
      data, 
      isLoading, 
      updateData, 
      addMessage, 
      markMessageAsRead, 
      deleteMessage,
      addBooking,
      updateBookingStatus,
      addOrder,
      updateOrderStatus,
      isAdmin, 
      isUserLoggedIn,
      currentUser,
      login, 
      logout,
      addUser,
      updateUser,
      deleteUser,
      resetToDefault 
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSiteData must be used within SiteProvider');
  return context;
};
