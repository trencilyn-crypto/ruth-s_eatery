import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

const Menu = () => {
  const { data } = useSiteData();

  return (
    <section id="menu" className="py-24" style={{ backgroundColor: data.theme.bgColor }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-semibold tracking-widest uppercase mb-2" style={{ color: data.theme.accentColor }}>Our Menu</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: data.theme.textColor }}>Delicious Selections</h3>
          <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: data.theme.accentColor }} />
        </div>

        {/* Category Navigation Navbar */}
        <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 mb-16 border-y border-gray-100 -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="container mx-auto flex justify-center items-center space-x-8 md:space-x-12 min-w-max">
            {data.menu.map((section) => (
              <a 
                key={section.category}
                href={`#cat-${section.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-bold uppercase tracking-widest transition-all hover:scale-110 active:scale-95"
                style={{ color: data.theme.textColor }}
              >
                {section.category}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-40">
          {data.menu.map((section, idx) => (
            <div 
              key={idx} 
              id={`cat-${section.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative scroll-mt-40"
            >
              {/* Category Header Showcase */}
              <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
                <div className="lg:w-1/2 space-y-6 order-2 lg:order-1">
                  <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: data.theme.accentColor + '15', color: data.theme.accentColor }}>
                    Premium Selection
                  </div>
                  <h4 className="text-5xl md:text-7xl font-serif font-bold leading-tight" style={{ color: data.theme.textColor }}>
                    {section.category}
                  </h4>
                  {section.description && (
                    <p className="text-xl text-gray-500 font-light max-w-lg leading-relaxed italic border-l-4 pl-6" style={{ borderColor: data.theme.accentColor }}>
                      "{section.description}"
                    </p>
                  )}
                </div>
                <div className="lg:w-1/2 order-1 lg:order-2 w-full h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src={section.image} alt={section.category} className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Menu Items Showcase */}
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-20">
                {section.items.map((item, itemIdx) => (
                  <motion.div
                    key={itemIdx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIdx * 0.1 }}
                    className="flex flex-col sm:flex-row gap-6 group"
                  >
                    <div className="relative w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={item.image || '/images/hero-eatery.jpg'} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <button 
                        onClick={() => (window as any).addToCart?.(item)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                         <Plus className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h5 className="text-2xl font-serif font-bold border-b border-transparent group-hover:border-current transition-all" style={{ color: data.theme.textColor }}>
                          {item.name}
                        </h5>
                        <div className="flex-1 h-[1px] border-b border-dotted mb-1.5 opacity-20" style={{ borderColor: data.theme.textColor }} />
                        <span className="text-xl font-bold" style={{ color: data.theme.accentColor }}>
                          {item.price}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-xl border-l-2 mb-4 group-hover:bg-amber-50/30 transition-colors" style={{ borderColor: data.theme.accentColor }}>
                        <p className="text-gray-600 leading-relaxed italic text-sm">
                          {item.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => (window as any).addToCart?.(item)}
                        className="self-start text-xs font-bold uppercase tracking-widest border-b-2 transition-all hover:translate-x-1"
                        style={{ borderColor: data.theme.accentColor, color: data.theme.accentColor }}
                      >
                        Add to Order
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-10 py-3 rounded-full font-bold transition-all">
            Download Full Menu (PDF)
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
