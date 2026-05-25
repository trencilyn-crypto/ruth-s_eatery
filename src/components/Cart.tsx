import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, Receipt as ReceiptIcon, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData, MenuItem } from '../context/SiteContext';

export interface CartItem extends MenuItem {
  quantity: number;
}

import AuthModal from './AuthModal';

const Cart = () => {
  const { data, addOrder, isUserLoggedIn, currentUser } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'cart' | 'checkout' | 'receipt'>('cart');
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState({ street: '', barangay: '', city: '', notes: '' });
  const [orderInfo, setOrderInfo] = useState({ name: '', phone: '' });

  // Pre-fill user info if logged in
  useEffect(() => {
    if (isUserLoggedIn && currentUser) {
      setOrderInfo(prev => ({ ...prev, name: currentUser.name }));
    }
  }, [isUserLoggedIn, currentUser]);

  // Expose cart addition via window for simplicity in this demo
  React.useEffect(() => {
    (window as any).addToCart = (item: MenuItem) => {
      setCart(prev => {
        const existing = prev.find(i => i.name === item.name);
        if (existing) {
          return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      setIsOpen(true);
      setStep('cart');
    };
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return acc + (price * item.quantity);
  }, 0);
  
  const deliveryFee = orderType === 'delivery' ? parseFloat(data.settings.deliveryFee.replace(/[^\d.-]/g, '')) : 0;
  const total = subtotal + deliveryFee;

  const updateQuantity = (name: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.name === name) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = orderType === 'delivery' 
      ? `${address.street}, Brgy. ${address.barangay}, ${address.city} (${address.notes})`
      : undefined;

    addOrder({
      userId: currentUser!.email,
      customerName: orderInfo.name,
      phone: orderInfo.phone,
      type: orderType,
      address: fullAddress,
      items: cart,
      total: total
    });
    setStep('receipt');
  };

  const closeCart = () => {
    setIsOpen(false);
    if (step === 'receipt') {
      setCart([]);
      setStep('cart');
    }
  };

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-white text-gray-900 p-4 rounded-full shadow-2xl flex items-center space-x-2 border border-gray-100 hover:scale-110 transition-transform"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </div>
        <span className="font-bold pr-2">₱{subtotal.toLocaleString()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {step === 'receipt' ? <ReceiptIcon className="text-green-600" /> : <ShoppingBag />}
                  {step === 'cart' && 'Your Order'}
                  {step === 'checkout' && 'Checkout'}
                  {step === 'receipt' && 'Order Confirmed'}
                </h2>
                <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
                  <X />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 && step !== 'receipt' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-gray-50 p-6 rounded-full">
                      <ShoppingBag className="h-12 w-12 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Your bag is empty</h3>
                      <p className="text-gray-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {step === 'cart' && (
                      <div className="space-y-6">
                        {cart.map((item) => (
                          <div key={item.name} className="flex gap-4">
                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-amber-600 font-bold text-sm">{item.price}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <button onClick={() => updateQuantity(item.name, -1)} className="p-1 border border-gray-200 rounded">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.name, 1)} className="p-1 border border-gray-200 rounded">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <button onClick={() => updateQuantity(item.name, -item.quantity)} className="text-gray-300 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {step === 'checkout' && (
                      <form onSubmit={handleCheckout} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setOrderType('pickup')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                              orderType === 'pickup' ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400'
                            }`}
                          >
                            <MapPin />
                            <span className="font-bold text-sm">Pickup</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderType('delivery')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                              orderType === 'delivery' ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-gray-100 text-gray-400'
                            }`}
                          >
                            <Truck />
                            <span className="font-bold text-sm">Delivery</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Name</label>
                              <input
                                required
                                type="text"
                                placeholder="Full Name"
                                value={orderInfo.name}
                                onChange={e => setOrderInfo({ ...orderInfo, name: e.target.value })}
                                className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-500/20"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Phone</label>
                              <input
                                required
                                type="tel"
                                placeholder="09XX-XXX-XXXX"
                                value={orderInfo.phone}
                                onChange={e => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                                className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-amber-500/20"
                              />
                            </div>
                          </div>

                          {orderType === 'delivery' && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                               <h4 className="text-sm font-bold text-gray-900">Delivery Address</h4>
                               <input
                                 required
                                 placeholder="House No., Street Name"
                                 value={address.street}
                                 onChange={e => setAddress({ ...address, street: e.target.value })}
                                 className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none"
                               />
                               <div className="grid grid-cols-2 gap-4">
                                  <input
                                    required
                                    placeholder="Barangay"
                                    value={address.barangay}
                                    onChange={e => setAddress({ ...address, barangay: e.target.value })}
                                    className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none"
                                  />
                                  <input
                                    required
                                    placeholder="City"
                                    value={address.city}
                                    onChange={e => setAddress({ ...address, city: e.target.value })}
                                    className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none"
                                  />
                               </div>
                               <textarea
                                 placeholder="Nearby landmarks or instructions"
                                 value={address.notes}
                                 onChange={e => setAddress({ ...address, notes: e.target.value })}
                                 className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white outline-none min-h-[80px]"
                               />
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500">
                          {orderType === 'pickup' 
                            ? `Pickup from: ${data.contact.address}`
                            : `Estimated delivery time: 30-45 mins`}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 shadow-xl"
                        >
                          Place Order (₱{total.toLocaleString()})
                        </button>
                      </form>
                    )}

                    {step === 'receipt' && (
                      <div className="space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center">
                          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Thank you, {orderInfo.name}!</h3>
                          <p className="text-gray-500 mt-1">Order #RH-{Math.floor(Math.random() * 9000) + 1000}</p>
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-6">
                          <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4 text-center">Receipt Details</h4>
                          <div className="space-y-3">
                            {cart.map(item => (
                              <div key={item.name} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-mono">₱{(parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Subtotal</span>
                              <span className="font-mono">₱{subtotal.toLocaleString()}</span>
                            </div>
                            {orderType === 'delivery' && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="font-mono">₱{deliveryFee.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                              <span>Total Paid</span>
                              <span className="text-amber-600">₱{total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <h5 className="font-bold text-amber-800 text-xs uppercase mb-1">{orderType === 'pickup' ? 'Ready for Pickup' : 'Heading to you'}</h5>
                          <p className="text-amber-700 text-sm">
                            {orderType === 'pickup' 
                              ? 'Your order will be ready in 15-20 minutes.'
                              : `Delivering to: ${address.street}, ${address.barangay}`}
                          </p>
                        </div>

                        <button
                          onClick={closeCart}
                          className="w-full border-2 border-gray-900 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Close Receipt
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer (only for cart step) */}
              {step === 'cart' && cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-gray-500 uppercase text-xs">Subtotal</span>
                    <span className="text-xl font-bold">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!isUserLoggedIn) {
                        setIsAuthModalOpen(true);
                      } else {
                        setStep('checkout');
                      }
                    }}
                    className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
