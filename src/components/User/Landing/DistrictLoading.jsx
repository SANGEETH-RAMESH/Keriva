import React from 'react';

const InfiniteMarquee = () => {
  const items = ['Kasargod', 'Kannur', 'Wayanad','Kozhikode', 'Malappuram', 'Palakkad','Thrissur','Ernakulam','Idukki','Kottayam','Alappuzha','Pathanamthitta','Kollam','Thiruvananthapuram'];

  return (
    // Increased vertical padding (py-24) to give it proper breathing room between your sections
    <div className="flex w-full overflow-hidden bg-white py-24 border-y border-gray-100">
      
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 60s linear infinite;
            width: max-content;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* The scrolling track */}
      <div className="flex animate-scroll items-center">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div 
            key={index} 
            className="flex items-center"
          >
            {/* The text: softer color, slightly smaller, wider tracking for an elegant look */}
            <span className="mx-12 text-2xl md:text-3xl font-medium tracking-widest text-gray-400 uppercase">
              {item}
            </span>
            
            {/* A subtle star/diamond separator to cleanly divide the words */}
            <span className="text-gray-200 text-xl">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMarquee;