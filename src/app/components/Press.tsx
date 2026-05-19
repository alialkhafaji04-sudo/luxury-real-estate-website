import { useEffect, useRef } from 'react';

export function Press() {
  const testimonials = [
    {
      source: 'Google Review',
      quote: 'Laurent, Emre, and Ezgi all bring real professionalism and genuine care to what they do. You can tell they take their craft seriously and treat clients like the relationship matters.',
      client: 'Jamil A.'
    },
    {
      source: 'Google Review',
      quote: 'Laurent and Alejandro met all my real estate needs in a professional, efficient and caring manner. They have a very patient attitude ensuring that I would be 100% happy with the purchase.',
      client: 'Arta M.'
    },
    {
      source: 'Zillow Review',
      quote: 'In this day and age it is hard to find someone that you trust, someone that you can honestly say has your best interest at heart. Luckily we found someone that was all that and more.',
      client: 'Natasha M.'
    },
    {
      source: 'Yelp Review',
      quote: 'Laurent Louvet will go to the moon and back for you. His integrity and work ethic has no equal. I have completed two transactions with Laurent and he is the best of the best.',
      client: 'Luisa L.'
    },
    {
      source: 'Yelp Review',
      quote: 'Laurent and every single person on his team are incredible. They are professional and fun to work with. They respond to EVERY concern in a timely manner.',
      client: 'Sophie J.'
    },
    {
      source: 'Yelp Review',
      quote: 'The team was willing to go above and beyond, showing us every possible option, listening to our concerns and putting our minds at ease. They helped us buy our first home.',
      client: 'Molly S.'
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollContainer.scrollWidth && scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="bg-[#0A0A0A] py-24 border-t border-[#C9A961]/10">
      <div className="max-w-[1920px] mx-auto px-8">
        <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          What Our Clients Say
        </p>

        <div ref={scrollRef} className="flex overflow-x-hidden gap-8 pb-4 scrollbar-hide">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-[400px] flex-shrink-0 border-l border-[#C9A961]/30 pl-8 pr-8"
            >
              <div className="text-[#F5F1E8]/40 uppercase text-xs tracking-widest mb-3">
                {testimonial.source}
              </div>
              <p
                className="text-[#F5F1E8] mb-3 whitespace-normal"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', lineHeight: 1.5, fontWeight: 300, fontStyle: 'italic' }}
              >
                "{testimonial.quote}"
              </p>
              <div className="text-[#C9A961]/60 text-xs tracking-wider">— {testimonial.client}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
