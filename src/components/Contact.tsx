import { Phone, Mail, MapPin, MessageCircle, Share2, Globe } from 'lucide-react';

import { useSiteData } from '../context/SiteContext';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const Contact = () => {
  const { data, addMessage } = useSiteData();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: data.theme.bgColor }}>
      <div className="container mx-auto px-6">
        <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-1/3 p-12 text-white" style={{ backgroundColor: data.theme.accentColor }}>
            <h3 className="text-3xl font-serif font-bold mb-8">Contact Information</h3>
            <p className="mb-10 opacity-90">
              We'd love to hear from you. Whether you have a question about our menu or want to book a special event.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <Phone className="h-5 w-5" />
                </div>
                <span>{data.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <span>{data.contact.email}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>{data.contact.address}</span>
              </div>
            </div>

            <div className="mt-16 flex space-x-6">
              <a href="#" className="hover:text-amber-200 transition-colors"><Share2 /></a>
              <a href="#" className="hover:text-amber-200 transition-colors"><MessageCircle /></a>
              <a href="#" className="hover:text-amber-200 transition-colors"><Globe /></a>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3 p-12 bg-white">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Send us a Message</h3>
            
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-500">Thank you for reaching out. We will get back to you soon.</p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-8 text-amber-600 font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Inquiry about catering"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
