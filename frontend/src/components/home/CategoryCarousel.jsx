import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../../context/JobContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "DevOps Engineer",
  "Mobile App Developer",
  "UI/UX Designer"
];

const CategoryCarousel = () => {
  const { setSearchedQuery } = useJob();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const searchJobHandler = (category) => {
    setSearchedQuery(category);
    navigate("/browse");
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 my-8">
      <div className="relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-purple-600 hover:border-purple-300 transition-all focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth px-6 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => searchJobHandler(cat)}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 shadow-sm transition-all hover:scale-105 shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-purple-600 hover:border-purple-300 transition-all focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCarousel;
