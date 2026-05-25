import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Edit3 } from 'lucide-react';

import { useSiteData } from '../context/SiteContext';

const About = () => {
  const { data } = useSiteData();

  return (
    <section id="about" className="py-24 overflow-hidden" style={{ backgroundColor: data.theme.bgColor, color: data.theme.textColor }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={data.about.image}
                alt="About Image"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Background decorative box */}
            <div className="absolute -top-6 -left-6 w-64 h-64 -z-10 rounded-2xl opacity-20" style={{ backgroundColor: data.theme.accentColor }} />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 -z-10 rounded-2xl opacity-10" style={{ backgroundColor: data.theme.accentColor }} />

            <div className="absolute bottom-8 right-8 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block border border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="font-bold text-gray-900 italic">"The best food in town!"</p>
              <p className="text-sm text-gray-500">- Local Foodie</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="font-semibold tracking-widest uppercase mb-2" style={{ color: data.theme.accentColor }}>{data.about.title}</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight" style={{ color: data.theme.textColor }}>
              {data.about.subtitle}
            </h3>
            <p className="text-lg mb-8 leading-relaxed opacity-80" style={{ color: data.theme.textColor }}>
              {data.about.description}
            </p>

            <div className="mt-12 p-8 rounded-3xl bg-white border border-gray-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
              <h4 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2" style={{ color: data.theme.textColor }}>
                <Edit3 className="h-5 w-5 text-amber-600" />
                {data.about.storyTitle}
              </h4>
              <p className="text-gray-600 leading-relaxed italic">
                {data.about.storyContent}
              </p>
            </div>

            <div className="space-y-6 mt-12">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Award Winning Cuisine</h4>
                  <p className="text-gray-600">Recognized as the top eatery in the region for three consecutive years.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Fresh Ingredients Daily</h4>
                  <p className="text-gray-600">We source our produce from local farmers every morning to ensure peak flavor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cozy Atmosphere</h4>
                  <p className="text-gray-600">Designed to be your home away from home, perfect for any occasion.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
