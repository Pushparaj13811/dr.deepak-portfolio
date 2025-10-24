import { useState } from "react";
import type { PortfolioItem } from "../../types";

interface PortfolioProps {
  items: PortfolioItem[];
}

export function Portfolio({ items }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Work");

  // Get unique categories
  const categories = ["All Work", ...Array.from(new Set(items.map((item) => item.category)))];

  // Filter items by category
  const filteredItems = activeCategory === "All Work"
    ? items
    : items.filter((item) => item.category === activeCategory);

  // Define varied heights for masonry effect
  const getItemHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-96', 'h-72', 'h-88', 'h-64', 'h-80', 'h-96', 'h-72'];
    return heights[index % heights.length];
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">My Portfolio</h2>
          <div className="w-24 h-1 bg-blue-600"></div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Portfolio Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid mb-6"
            >
              <div className={`${getItemHeight(index)} relative`}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/90 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No portfolio items found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
