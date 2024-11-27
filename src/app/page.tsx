'use client';

import React, { useState, useMemo } from 'react';
import { Search, Grid2x2, Grid3x3, X, ExternalLink } from 'lucide-react';
import _ from 'lodash';

// Define the structure for our logo data
interface Logo {
  id: number;
  name: string;
  year: number;
  color: string;
  type: string;
  imageUrl: string;
  source: string;
}

// Enhanced function to safely convert filenames into logo objects
function parseLogoFromFilename(filename: string, id: number): Logo {
  try {
    // Add safety checks for the filename
    if (!filename) {
      throw new Error('Filename is required');
    }

    const withoutExtension = filename.split('.')[0];
    const parts = withoutExtension.split('|');
    
    // Verify we have all required parts
    if (parts.length !== 5) {
      throw new Error('Invalid filename format');
    }

    const [name, color, source, type, year] = parts;
    
    // Add null checks for each part
    if (!name || !color || !source || !type || !year) {
      throw new Error('Missing required parts in filename');
    }

    return {
      id,
      name: name.replace(/([A-Z])/g, ' $1').trim(),
      year: parseInt(year) || 2000,
      color: (color || '').toLowerCase(),
      type: (type || '').toLowerCase(),
      imageUrl: `/logos/${filename}`,
      source: source.startsWith('www') ? `https://${source}` : source
    };
  } catch (error) {
    console.error('Error parsing filename:', filename, error);
    return {
      id,
      name: 'Invalid Logo',
      year: 2000,
      color: 'black',
      type: 'serif',
      imageUrl: '/logos/default.png',
      source: 'https://example.com'
    };
  }
}
// SearchBar component with enhanced error handling
const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Safely handle input changes with error boundary
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value || '';
      setSearchValue(value);
      onSearch(value);
    } catch (error) {
      console.error('Error in search input:', error);
      setSearchValue('');
      onSearch('');
    }
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

// GridSizeSelector component with safety checks
const GridSizeSelector = ({ size, onSizeChange }: { 
  size: number; 
  onSizeChange: (size: number) => void 
}) => {
  // Ensure size has a valid value
  const safeSize = size || 8;  // Default to 8 if size is undefined
  
  const sizes = [
    { id: 4, icon: Grid3x3, label: '4 per row' },
    { id: 8, icon: Grid2x2, label: '8 per row' }
  ];

  const handleSizeChange = (newSize: number) => {
    try {
      onSizeChange(newSize);
    } catch (error) {
      console.error('Error changing grid size:', error);
      onSizeChange(8); // Default to 8 if there's an error
    }
  };

  return (
    <div className="flex gap-2">
      {sizes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleSizeChange(id)}
          className={`p-1.5 rounded-lg transition-colors ${
            safeSize === id
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
// ColorSelector component with enhanced error handling
const ColorSelector = ({ selectedColor, onColorSelect }: { 
  selectedColor: string; 
  onColorSelect: (color: string) => void 
}) => {
  // Define available colors with safe fallbacks
  const colors = [
    { id: 'blue', bg: 'bg-blue-600' },
    { id: 'red', bg: 'bg-red-600' },
    { id: 'black', bg: 'bg-black' },
    { id: 'white', bg: 'bg-white border border-gray-700' }
  ];

  // Ensure we have a valid selectedColor
  const safeSelectedColor = selectedColor || '';

  // Safely handle color selection with error boundary
  const handleColorSelect = (colorId: string) => {
    try {
      onColorSelect(safeSelectedColor === colorId ? '' : colorId);
    } catch (error) {
      console.error('Error selecting color:', error);
      onColorSelect(''); // Reset to no color if there's an error
    }
  };

  return (
    <div className="flex gap-2">
      {colors.map(({ id, bg }) => (
        <button
          key={id}
          onClick={() => handleColorSelect(id)}
          className={`w-6 h-6 rounded-lg transition-transform ${bg} ${
            safeSelectedColor === id ? 'scale-95 ring-2 ring-gray-400' : 'hover:scale-105'
          }`}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
        />
      ))}
    </div>
  );
};

// TypographySelector component with enhanced error handling
const TypographySelector = ({ selected, onSelect }: { 
  selected: string; 
  onSelect: (type: string) => void 
}) => {
  // Ensure we have a valid selected value
  const safeSelected = selected || '';

  // Safely handle type selection with error boundary
  const handleTypeSelect = (type: string) => {
    try {
      onSelect(safeSelected === type ? '' : type);
    } catch (error) {
      console.error('Error selecting typography:', error);
      onSelect(''); // Reset to no type if there's an error
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleTypeSelect('serif')}
        className={`px-3 py-1 rounded-lg transition-colors ${
          safeSelected === 'serif'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <span className="font-serif">Aa</span>
      </button>
      <button
        onClick={() => handleTypeSelect('sans-serif')}
        className={`px-3 py-1 rounded-lg transition-colors ${
          safeSelected === 'sans-serif'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <span className="font-sans">Aa</span>
      </button>
    </div>
  );
};
// LogoCard component with enhanced error handling and safety checks
const LogoCard = ({ logo }: { logo: Logo }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safely handle the URL display with error checking
  const getDisplayUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (error) {
      console.error('Invalid URL:', url);
      return 'website unavailable';
    }
  };

  // Handle image loading errors
  const handleImageError = () => {
    console.warn(`Image failed to load for logo: ${logo.name}`);
    setImageError(true);
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all hover:shadow-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer"
      >
        <div className="aspect-square w-full relative">
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-900">
            {!imageError ? (
              <img
                src={logo.imageUrl}
                alt={logo.name || 'Logo image'}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              <div className="text-gray-500 text-sm">Image unavailable</div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 w-full p-4 text-white">
            <h3 className="text-sm font-medium mb-1">{logo.name || 'Unnamed Logo'}</h3>
            <div className="flex gap-2 text-xs text-gray-300">
              <span>{logo.year || 'Year unknown'}</span>
              <span>•</span>
              <span>{logo.type || 'Type unknown'}</span>
            </div>
            {logo.source && (
              <a 
                href={logo.source}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Verify URL is valid before opening
                  try {
                    new URL(logo.source);
                  } catch (error) {
                    e.preventDefault();
                    console.error('Invalid source URL:', logo.source);
                  }
                }}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
              >
                {getDisplayUrl(logo.source)}
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="max-w-4xl w-full mx-4 bg-gray-800 rounded-lg border border-gray-700/50 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">
                    {logo.name || 'Unnamed Logo'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {logo.year || 'Year unknown'} • {logo.type || 'Type unknown'}
                  </p>
                  {logo.source && (
                    <a 
                      href={logo.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                    >
                      Source
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center justify-center bg-gray-900 rounded-lg p-8">
                {!imageError ? (
                  <img
                    src={logo.imageUrl}
                    alt={logo.name || 'Logo image'}
                    className="max-w-full max-h-[60vh] object-contain"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="text-gray-500">Image unavailable</div>
                )}
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
// Main LogoViewer component with enhanced error handling and safety features
const LogoViewer = () => {
  // Initialize state with safe default values
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ color: '', type: '' });
  const [gridSize, setGridSize] = useState(8);

  // Helper function to safely check if a year falls within a decade
  const isInDecade = (year: number, searchYear: number): boolean => {
    try {
      const decadeStart = Math.floor(searchYear / 10) * 10;
      const decadeEnd = decadeStart + 9;
      return year >= decadeStart && year <= decadeEnd;
    } catch (error) {
      console.error('Error checking decade match:', error);
      return false;
    }
  };
  
  // Our logo filenames - each following the pattern: Name|Color|Website|Type|Year.png
  const logoFilenames = [
    "BarcelonaArchives|Blue|www.arxiu.barcelona|Serif|1922.png",
    "CatalunyaRadio|Red|www.ccma.cat|SansSerif|1983.png"
    // Add your logo filenames here
  ];

  // Safely convert filenames into Logo objects with error handling
  const logos: Logo[] = useMemo(() => {
    try {
      return logoFilenames.map((filename, index) => 
        parseLogoFromFilename(filename, index + 1)
      );
    } catch (error) {
      console.error('Error processing logo filenames:', error);
      return [];
    }
  }, [logoFilenames]);

  // Create a debounced search function with cleanup
  const debouncedSearch = useMemo(
    () => _.debounce((term: string) => {
      try {
        setSearchTerm(term);
      } catch (error) {
        console.error('Error in search debounce:', error);
        setSearchTerm('');
      }
    }, 300),
    []
  );

  // Cleanup debounced function on component unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filter logos with comprehensive error handling
  const filteredLogos = useMemo(() => {
    try {
      if (!logos) return [];
      
      return logos.filter(logo => {
        try {
          const searchLower = (searchTerm || '').toLowerCase();
          
          // Safely check for year match
          const searchYear = parseInt(searchTerm);
          const yearMatch = !isNaN(searchYear) ? isInDecade(logo.year, searchYear) : false;
          
          // Apply all filters with null checks
          const matchesSearch = 
            (logo.name || '').toLowerCase().includes(searchLower) ||
            yearMatch;
          const matchesColor = !filters.color || logo.color === filters.color;
          const matchesType = !filters.type || logo.type === filters.type;
          
          return matchesSearch && matchesColor && matchesType;
        } catch (error) {
          console.error('Error filtering logo:', logo, error);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in filteredLogos:', error);
      return [];
    }
  }, [searchTerm, filters, logos]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed header with search and filters */}
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

      {/* Main content area with responsive grid */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Dynamic grid that adjusts based on screen size and selected grid size */}
        <div className={`grid gap-6 ${
          gridSize === 4 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'
        }`}>
          {filteredLogos.map(logo => (
            <LogoCard key={logo.id} logo={logo} />
          ))}
        </div>
        
        {/* Show message when no logos match the current filters */}
        {filteredLogos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No matching logos found
          </div>
        )}
      </main>
    </div>
  );
};

// Export the LogoViewer as the default component for this page
export default LogoViewer;
