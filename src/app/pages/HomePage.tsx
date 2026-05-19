import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { SoldProperties } from '../components/SoldProperties';
import { Press } from '../components/Press';
import { Listings } from '../components/Listings';
import { Neighborhoods } from '../components/Neighborhoods';
import { Services } from '../components/Services';
import { Contact } from '../components/Contact';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      <Hero />
      <div id="listings">
        <Listings />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="sold-properties">
        <SoldProperties />
      </div>
      <Press />
      <div id="neighborhoods">
        <Neighborhoods />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
}
