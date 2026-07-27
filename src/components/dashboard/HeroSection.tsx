import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Sparkle } from 'lucide-react';

interface HeroSectionProps {
  promptInput: string;
  setPromptInput: (value: string) => void;
  handleGenerate: (e: React.FormEvent) => void;
  setActiveSubTab?: (tab: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  promptInput,
  setPromptInput,
  handleGenerate,
  setActiveSubTab
}) => {
  const [carouselIndex, setCarouselIndex] = useState(1);

  const carouselSlides = [
    {
      title: "Minimal Beige",
      subtitle: "Y2K beige outfit, clean aesthetic",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
      creator: "@elena_rostova"
    },
    {
      title: "Monochrome Tailoring Core",
      subtitle: "Tactical sleek black suits & chains",
      imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop",
      creator: "@hamza_ali"
    },
    {
      title: "Midnight Silhouette",
      subtitle: "Avant-garde flowing leather alignments",
      imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=600&auto=format&fit=crop",
      creator: "@ayesha_malik"
    },
    {
      title: "Urban Streetwear Aura",
      subtitle: "Casual loose-fitting cargo aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      creator: "@sarah_khan"
    },
    {
      title: "Korean Aesthetic Core",
      subtitle: "Tailored minimal outerwear style",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
      creator: "@noor_fatima"
    }
  ];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative overflow-visible py-2 text-left">
      
      {/* Ambient Backlight Glow behind the carousel */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Hero Left Content Area */}
      <div className="md:col-span-5 space-y-4.5 z-10 relative">
        <div className="space-y-3.5 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-bold font-sans tracking-tight text-white leading-[1.12]">
            Create. Inspire.<br />
            Express with <span className="text-violet-500 font-bold">AI.</span>
          </h2>
          
          <p className="text-zinc-400 text-xs font-sans leading-relaxed">
            Generate stunning fashion looks,<br />in seconds.
          </p>
        </div>

        {/* Pill-shaped Prompt Generator Box */}
        <form onSubmit={handleGenerate} className="max-w-md pt-2">
          <div className="relative flex items-center bg-[#13131f]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 focus-within:border-violet-500/50 transition-all shadow-2xl">
            <Sparkle className="w-4 h-4 text-violet-400 fill-violet-400/20 ml-4 shrink-0" />
            <input 
              type="text"
              placeholder="What do you want to wear today?"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-transparent pl-3 pr-28 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-light"
            />
            <button 
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#5b21b6] hover:bg-violet-800 text-white text-[11px] font-sans font-bold px-6 py-2 rounded-full cursor-pointer transition-all active:scale-95 shadow-md"
            >
              Generate
            </button>
          </div>
        </form>

        {/* Quick Vibe Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {['Casual', 'Streetwear', 'Minimal', 'Luxury', 'Korean', 'Y2K'].map((vtag) => (
            <button
              type="button"
              key={vtag}
              onClick={() => setPromptInput(`A stunning ${vtag.toLowerCase()} outfit arrangement, detailed fabrics, premium studio look`)}
              className="px-3.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10.5px] font-sans text-zinc-400 cursor-pointer transition-all duration-200"
            >
              {vtag}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPromptInput('A stunning couture collection drop matching modern minimalist aesthetic, cinematic studio light');
            }}
            className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white rounded-full text-xs cursor-pointer transition-all"
          >
            +
          </button>
        </div>

        {/* Social Proof Avatar Stack */}
        <div className="flex items-center gap-3 pt-3">
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black/80 object-cover" alt="" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black/80 object-cover" alt="" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black/80 object-cover" alt="" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=80&auto=format&fit=crop" className="w-7 h-7 rounded-full border border-black/80 object-cover" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="text-left text-[11px] font-sans leading-tight">
            <p className="font-semibold text-zinc-300">50,000+ fashion lovers</p>
            <p className="text-zinc-500">creating with AI</p>
          </div>
        </div>
      </div>

      {/* Hero Right Content Area: 3D Overlapping Card Carousel */}
      <div className="md:col-span-7 h-[260px] flex items-center justify-start relative select-none mt-4 md:mt-0 px-2 md:-ml-8 lg:-ml-12">
        
        {/* Absolute Orbital Ring Track behind the side cards, wrapping around */}
        <div className="absolute w-[110%] h-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <svg className="w-full h-full opacity-60" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(200, 100) rotate(-6)">
              <ellipse cx="0" cy="0" rx="175" ry="50" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
              <ellipse cx="0" cy="0" rx="171" ry="47" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.2" />
            </g>
          </svg>
          
          {/* Sparkles strategically placed on orbital path */}
          <div className="absolute top-[28%] left-[12%] text-violet-400 opacity-60"><Sparkle className="w-3 h-3 fill-violet-400" /></div>
          <div className="absolute top-[18%] right-[10%] text-violet-400 opacity-80"><Sparkle className="w-3.5 h-3.5 fill-violet-400" /></div>
          <div className="absolute bottom-[20%] left-[28%] text-violet-400 opacity-40"><Sparkle className="w-2.5 h-2.5 fill-violet-400" /></div>
          <div className="absolute bottom-[16%] right-[16%] text-violet-400 opacity-60"><Sparkle className="w-3 h-3 fill-violet-400" /></div>
        </div>

        {/* Card Container wrapper */}
        <div className="relative w-full max-w-[380px] h-[240px] flex items-center justify-center">
          
          {/* Left Arrow Button positioned precisely on orbital line end */}
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-[1%] top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-violet-600 border border-white/10 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button positioned precisely on orbital line end */}
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-[1%] top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-violet-600 border border-white/10 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* LEFT UNDERLAYING CARD */}
          {(() => {
            const leftIdx = (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
            const slide = carouselSlides[leftIdx];
            return (
              <div 
                onClick={() => setCarouselIndex(leftIdx)}
                className="absolute left-[8%] top-1/2 -translate-y-1/2 w-[110px] h-[180px] z-10 opacity-30 hover:opacity-50 transition-all duration-300 rounded-2xl overflow-hidden border border-white/5 -rotate-[8deg] cursor-pointer shadow-2xl group select-none hover:scale-105"
              >
                <img src={slide.imageUrl || null} alt="" className="w-full h-full object-cover grayscale opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            );
          })()}

          {/* CENTER FEATURED CARD */}
          {(() => {
            const slide = carouselSlides[carouselIndex % carouselSlides.length];
            return (
              <div 
                onClick={() => {
                  if (setActiveSubTab) setActiveSubTab('AI_STUDIO');
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[225px] z-20 transition-all duration-500 rounded-3xl overflow-hidden border-2 border-violet-500/20 cursor-pointer shadow-[0_15px_35px_rgba(124,58,237,0.25)] group select-none hover:scale-[1.02]"
              >
                <img src={slide.imageUrl || null} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                {/* AI Generated Pill Overlay at the Bottom of center card */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl select-none min-w-[110px] justify-center transition-all duration-200">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 fill-violet-400/20 animate-pulse" />
                  <span className="text-[9.5px] font-sans font-medium tracking-wide text-white whitespace-nowrap">AI Generated</span>
                </div>
              </div>
            );
          })()}

          {/* RIGHT UNDERLAYING CARD */}
          {(() => {
            const rightIdx = (carouselIndex + 1) % carouselSlides.length;
            const slide = carouselSlides[rightIdx];
            return (
              <div 
                onClick={() => setCarouselIndex(rightIdx)}
                className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[110px] h-[180px] z-10 opacity-30 hover:opacity-50 transition-all duration-300 rounded-2xl overflow-hidden border border-white/5 rotate-[8deg] cursor-pointer shadow-2xl group select-none hover:scale-105"
              >
                <img src={slide.imageUrl || null} alt="" className="w-full h-full object-cover grayscale opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            );
          })()}

          {/* Navigation Dots at the very bottom */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
            {carouselSlides.map((_, dotIndex) => {
              const isActive = (carouselIndex % carouselSlides.length) === (dotIndex % carouselSlides.length);
              return (
                <button
                  key={dotIndex}
                  onClick={() => setCarouselIndex(dotIndex)}
                  className={`transition-all duration-300 rounded-full h-1.5 ${
                    isActive ? 'w-4 bg-violet-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
