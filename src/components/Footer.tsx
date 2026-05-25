import { UtensilsCrossed, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <UtensilsCrossed className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-serif font-bold tracking-tight">
                Ruthy <span className="text-amber-500">Eatery</span>
              </span>
            </div>
            <p className="text-stone-400 max-w-sm mb-8">
              Crafting unforgettable culinary experiences since 2015. We believe in the power of good food to bring people together.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-stone-400">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-amber-500 transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-amber-500 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Hours</h4>
            <ul className="space-y-4 text-stone-400">
              <li className="flex justify-between">
                <span>Mon - Thu</span>
                <span>11am - 10pm</span>
              </li>
              <li className="flex justify-between border-t border-stone-800 pt-4">
                <span>Fri - Sat</span>
                <span>11am - 11pm</span>
              </li>
              <li className="flex justify-between border-t border-stone-800 pt-4 text-amber-500 font-bold">
                <span>Sunday</span>
                <span>10am - 9pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:row justify-between items-center text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Ruthy Eatery. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> in Foodie City
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
