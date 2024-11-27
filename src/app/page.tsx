'use client';

import React, { useState, useMemo } from 'react';
import { Search, Grid2x2, Grid3x3, X, ExternalLink } from 'lucide-react';
import _ from 'lodash';

// Add error handling to our parser
function parseLogoFromFilename(filename: string, id: number): Logo {
  try {
    const withoutExtension = filename.split('.')[0];
    const [name, color, source, type, year] = withoutExtension.split('|');
    
    // Verify we have all parts
    if (!name || !color || !source || !type || !year) {
      console.warn(`Invalid filename format: ${filename}`);
      return {
        id,
        name: "Invalid Logo",
        year: 2000,
        color: "black",
        type: "serif",
        imageUrl: "/logos/default.png",
        source: "https://example.com"
      };
    }
    
    return {
      id,
      name: name.replace(/([A-Z])/g, ' $1').trim(),
      year: parseInt(year) || 2000,
      color: color.toLowerCase(),
      type: type.toLowerCase(),
      imageUrl: `/logos/${filename}`,
      source: source.startsWith('www') ? `https://${source}` : source
    };
  } catch (error) {
    console.error(`Error parsing filename: ${filename}`, error);
    return {
      id,
      name: "Error Loading Logo",
      year: 2000,
      color: "black",
      type: "serif",
      imageUrl: "/logos/default.png",
      source: "https://example.com"
    };
  }
}

// In your LogoViewer component, let's add error handling for the logo loading
const LogoViewer = () => {
  const logoFilenames = [
    "BarcelonaArchives|Blue|www.arxiu.barcelona|Serif|1922.png",
    "CatalunyaRadio|Red|www.ccma.cat|SansSerif|1983.png"
  ];

  // Add error checking when creating logos
  const logos: Logo[] = useMemo(() => {
    return logoFilenames.map((filename, index) => 
      parseLogoFromFilename(filename, index + 1)
    );
  }, [logoFilenames]);
  
// Searchbar component that expands on focus
// This creates a smooth, interactive search experience similar to Notion
const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`relative transition-all duration-200 ${
      isExpanded ? 'w-64' : 'w-36'
    }`}>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={14} />
      </div>
      <input
        type="text"
        value={searchValue}
        className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg 
                   text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
        placeholder={isExpanded ? "Search name or year..." : "Search"}
        onChange={handleChange}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => !searchValue && setIsExpanded(false)}
      />
      {searchValue && (
        <button
          onClick={() => {
            setSearchValue('');
            onSearch('');
            setIsExpanded(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

// Grid size selector component
// Allows users to switch between different grid layouts
const GridSizeSelector = ({ 
  size, 
  onSizeChange 
}: { 
  size: number; 
  onSizeChange: (size: number) => void 
}) => {
  const sizes = [
    { id: 4, icon: Grid3x3, label: '4 per row' },
    { id: 8, icon: Grid2x2, label: '8 per row' }
  ];

  return (
    <div className="flex gap-2">
      {sizes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onSizeChange(id)}
          className={`p-1.5 rounded-lg transition-colors ${
            size === id
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

// Color selector component with proper styling
// Uses Tailwind classes for consistent styling
const ColorSelector = ({ 
  selectedColor, 
  onColorSelect 
}: { 
  selectedColor: string; 
  onColorSelect: (color: string) => void 
}) => {
  const colors = [
    { id: 'blue', bg: 'bg-blue-600' },
    { id: 'red', bg: 'bg-red-600' },
    { id: 'black', bg: 'bg-black' },
    { id: 'white', bg: 'bg-white border border-gray-700' }
  ];

  return (
    <div className="flex gap-2">
      {colors.map(({ id, bg }) => (
        <button
          key={id}
          onClick={() => onColorSelect(selectedColor === id ? '' : id)}
          className={`w-6 h-6 rounded-lg transition-transform ${bg} ${
            selectedColor === id ? 'scale-95 ring-2 ring-gray-400' : 'hover:scale-105'
          }`}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
        />
      ))}
    </div>
  );
};

// Typography selector component
// Allows switching between serif and sans-serif options
const TypographySelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: string; 
  onSelect: (type: string) => void 
}) => (
  <div className="flex gap-2">
    <button
      onClick={() => onSelect(selected === 'serif' ? '' : 'serif')}
      className={`px-3 py-1 rounded-lg transition-colors ${
        selected === 'serif'
          ? 'bg-gray-700 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
    >
      <span className="font-serif">Aa</span>
    </button>
    <button
      onClick={() => onSelect(selected === 'sans-serif' ? '' : 'sans-serif')}
      className={`px-3 py-1 rounded-lg transition-colors ${
        selected === 'sans-serif'
          ? 'bg-gray-700 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
    >
      <span className="font-sans">Aa</span>
    </button>
  </div>
);
// Logo card component with modal functionality
// Displays individual logo items with hover effects and detailed view
const LogoCard = ({ logo }: { logo: Logo }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all hover:shadow-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer"
      >
        <div className="aspect-square w-full relative">
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-900">
            <img
              src={logo.imageUrl}
              alt={logo.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 w-full p-4 text-white">
            <h3 className="text-sm font-medium mb-1">{logo.name}</h3>
            <div className="flex gap-2 text-xs text-gray-300">
              <span>{logo.year}</span>
              <span>•</span>
              <span>{logo.type}</span>
            </div>
            <a 
              href={logo.source}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
            >
              {new URL(logo.source).hostname}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="max-w-4xl w-full mx-4 bg-gray-800 rounded-lg border border-gray-700/50 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">{logo.name}</h2>
                  <p className="text-sm text-gray-300">{logo.year} • {logo.type}</p>
                  <a 
                    href={logo.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                  >
                    Source
                    <ExternalLink size={12} />
                  </a>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center justify-center bg-gray-900 rounded-lg p-8">
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Rights respective of owner of logo and image - This is an educational tool only
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// Main page component that brings everything together
export default function Page() {
  // State management for filters and grid layout
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ color: '', type: '' });
  const [gridSize, setGridSize] = useState(8);

  // Helper function to check if a year falls within a decade
  const isInDecade = (year: number, searchYear: number): boolean => {
    const decadeStart = Math.floor(searchYear / 10) * 10;
    const decadeEnd = decadeStart + 9;
    return year >= decadeStart && year <= decadeEnd;
  };
  
  // Sample data - replace with your actual data source
  // Add this function right before your LogoViewer component
function parseLogoFromFilename(filename: string, id: number): Logo {
  // Remove the file extension (.png, .jpg, etc.)
  const withoutExtension = filename.split('.')[0];
  
  // Split the remaining string at each | character
  const [name, color, source, type, year] = withoutExtension.split('|');
  
  // Create and return a Logo object with the parsed information
  return {
    id,
    name: name.replace(/([A-Z])/g, ' $1').trim(), // Add spaces before capital letters
    year: parseInt(year),
    color: color.toLowerCase(),
    type: type.toLowerCase(),
    imageUrl: `/logos/${filename}`, // Assuming images are in the public/logos directory
    source: source.startsWith('www') ? `https://${source}` : source
  };
}

// Inside your LogoViewer component, replace the old logos array with this:
const logoFilenames = [
  "BarcelonaArchives|Blue|www.arxiu.barcelona|Serif|1922.png",
  "CatalunyaRadio|Red|www.ccma.cat|SansSerif|1983.png"
];

// Convert filenames into Logo objects
const logos: Logo[] = logoFilenames.map((filename, index) => 
  parseLogoFromFilename(filename, index + 1)
);

  // Create a debounced search function to improve performance
  const debouncedSearch = useMemo(
    () => _.debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  // Cleanup debounced function on component unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filter logos based on search term and selected filters
  const filteredLogos = useMemo(() => {
    return logos.filter(logo => {
      const searchLower = searchTerm.toLowerCase();
      
      // Check if search term is a year
      const searchYear = parseInt(searchTerm);
      const yearMatch = !isNaN(searchYear) ? isInDecade(logo.year, searchYear) : false;
      
      const matchesSearch = 
        logo.name.toLowerCase().includes(searchLower) ||
        yearMatch;
      const matchesColor = !filters.color || logo.color === filters.color;
      const matchesType = !filters.type || logo.type === filters.type;
      
      return matchesSearch && matchesColor && matchesType;
    });
  }, [searchTerm, filters, logos]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 py-4 bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700/50 shadow-lg p-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <SearchBar onSearch={debouncedSearch} />
                <div className="flex items-center gap-6">
                  <ColorSelector
                    selectedColor={filters.color}
                    onColorSelect={(color) => setFilters({ ...filters, color })}
                  />
                  <div className="w-px h-6 bg-gray-700/50" />
                  <TypographySelector
                    selected={filters.type}
                    onSelect={(type) => setFilters({ ...filters, type })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <GridSizeSelector size={gridSize} onSizeChange={setGridSize} />
                <div className="w-px h-6 bg-gray-700/50" />
                <div className="text-sm text-gray-300">
                  PortalDiseno.es - University Project
                  <img src="/api/placeholder/24/24" alt="Logo" className="inline-block ml-2 w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with responsive grid layout */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Dynamic grid that changes based on selected grid size */}
        <div className={`grid gap-6 ${
          gridSize === 4 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'
        }`}>
          {filteredLogos.map(logo => (
            <LogoCard key={logo.id} logo={logo} />
          ))}
        </div>
        
        {/* Empty state message when no logos match the filters */}
        {filteredLogos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No matching logos found
          </div>
        )}
      </main>
    </div>
  );
}
