import React from 'react';

const defaultLogos = [
  { name: 'Swiggy', color: '#FC8019' },
  { name: 'Zomato', color: '#E23744' },
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Myntra', color: '#FF3F6C' },
  { name: 'Apollo', color: '#1A73E8' },
  { name: 'Bosch', color: '#E20015' },
  { name: 'Titan', color: '#1E3A5F' },
  { name: 'Tata', color: '#486AAE' },
];

export const TrustMarquee = ({ 
  logos = defaultLogos,
  title = "Trusted by leading enterprises",
  speed = 'normal', // slow, normal, fast
  className = ''
}) => {
  const speedClasses = {
    slow: 'animate-[marquee_40s_linear_infinite]',
    normal: 'animate-[marquee_25s_linear_infinite]',
    fast: 'animate-[marquee_15s_linear_infinite]'
  };

  return (
    <section className={`py-16 bg-slate-50 overflow-hidden ${className}`} data-testid="trust-marquee">
      {title && (
        <p className="text-center text-slate-500 font-medium mb-8 text-sm uppercase tracking-wider">
          {title}
        </p>
      )}
      
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />
        
        <div className="flex overflow-hidden">
          <div className={`flex gap-16 items-center ${speedClasses[speed]} hover:pause`}>
            {/* Double the logos for seamless loop */}
            {[...logos, ...logos].map((logo, index) => (
              <div 
                key={`logo-${logo.name}-${index}`}
                className="flex-shrink-0 px-8 py-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <div 
                  className="h-10 px-6 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ 
                    backgroundColor: `${logo.color}15`,
                    color: logo.color
                  }}
                >
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustMarquee;
