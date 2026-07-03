import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ShoppingBag, Eye, X, Info, Sparkles, Check, Heart } from "lucide-react";
import { Perfume } from "../perfumesData.js";
import { motion, AnimatePresence } from "motion/react";

interface PerfumeCatalogProps {
  onAddPerfumeToCart: (perfume: Perfume) => void;
  cartItemIds: string[];
}

type CategoryFilter = 'all' | 'oils' | 'oud' | 'men' | 'women' | 'unisex' | 'favorites';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export default function PerfumeCatalog({ onAddPerfumeToCart, cartItemIds }: PerfumeCatalogProps) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('featured');
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  useEffect(() => {
    async function loadPerfumes() {
      try {
        setLoading(true);
        const response = await fetch("/api/perfumes");
        if (!response.ok) {
          throw new Error("Failed to fetch perfumes catalog");
        }
        const data = await response.json();
        setPerfumes(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred loading the perfumes catalog");
      } finally {
        setLoading(false);
      }
    }
    loadPerfumes();
  }, []);
  
  // Favorites State from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("debs_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (perfumeId: string) => {
    setFavorites(prev => {
      let next: string[];
      if (prev.includes(perfumeId)) {
        next = prev.filter(id => id !== perfumeId);
      } else {
        next = [...prev, perfumeId];
      }
      try {
        localStorage.setItem("debs_favorites", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save favorites to localStorage", err);
      }
      return next;
    });
  };
  
  // Feedback state for newly added items
  const [addedFeedbackIds, setAddedFeedbackIds] = useState<Record<string, boolean>>({});

  const handleAddWithFeedback = (perfume: Perfume) => {
    onAddPerfumeToCart(perfume);
    setAddedFeedbackIds(prev => ({ ...prev, [perfume.id]: true }));
    setTimeout(() => {
      setAddedFeedbackIds(prev => ({ ...prev, [perfume.id]: false }));
    }, 1200);
  };

  // Filter & Search Logic
  const filteredPerfumes = perfumes.filter(p => {
    // Search Term match
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.topNotes.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.middleNotes.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.baseNotes.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.vibes.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category match
    let matchesCategory = true;
    if (activeCategory === 'oils') {
      matchesCategory = p.type === 'Perfume Oil';
    } else if (activeCategory === 'oud') {
      matchesCategory = p.type === 'Arabian Oud';
    } else if (activeCategory === 'men') {
      matchesCategory = p.category === 'Men';
    } else if (activeCategory === 'women') {
      matchesCategory = p.category === 'Women';
    } else if (activeCategory === 'unisex') {
      matchesCategory = p.category === 'Unisex';
    } else if (activeCategory === 'favorites') {
      matchesCategory = favorites.includes(p.id);
    }

    return matchesSearch && matchesCategory;
  });

  // Sorting Logic
  const sortedPerfumes = [...filteredPerfumes].sort((a, b) => {
    if (activeSort === 'price-asc') {
      return a.price - b.price;
    }
    if (activeSort === 'price-desc') {
      return b.price - a.price;
    }
    if (activeSort === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    // Default or featured - preserve order of database
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search perfumes, brands, or scent notes (e.g. Oud, vanilla, rose)..."
            className="w-full pl-11 pr-4 py-2.5 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 focus:bg-white rounded-xl text-sm transition font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <SlidersHorizontal className="text-neutral-400 w-4 h-4 hidden sm:block" />
          <select
            id="catalog-sort-select"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortOption)}
            className="bg-white border border-neutral-200 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 transition"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical: A-Z</option>
          </select>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { id: 'all', label: 'All Collections' },
          { id: 'favorites', label: `❤️ Saved Favorites (${favorites.length})` },
          { id: 'oils', label: 'Designer Perfume Oils' },
          { id: 'oud', label: 'Arabian Oud / Middle Eastern' },
          { id: 'men', label: "Sophisticated Men" },
          { id: 'women', label: "Elegant Women" },
          { id: 'unisex', label: "Exquisite Unisex" }
        ].map((cat) => (
          <button
            key={cat.id}
            id={`category-tab-${cat.id}`}
            onClick={() => setActiveCategory(cat.id as CategoryFilter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium border transition duration-250 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-burgundy-800 border-burgundy-800 text-white shadow-sm font-semibold"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4 animate-pulse">
              <div className="aspect-[4/3] bg-neutral-200 rounded-xl" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-neutral-200 rounded-full w-1/4" />
                  <div className="h-3 bg-neutral-200 rounded-full w-1/6" />
                </div>
                <div className="h-5 bg-neutral-200 rounded-lg w-2/3" />
                <div className="h-3 bg-neutral-200 rounded-full w-full" />
                <div className="h-3 bg-neutral-200 rounded-full w-5/6" />
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-4">
                <div className="h-6 bg-neutral-200 rounded-md w-1/3" />
                <div className="h-8 bg-neutral-200 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <span className="text-4xl block">⚠️</span>
          <h4 className="font-serif text-lg font-bold text-rose-800">Error Loading Scent Collections</h4>
          <p className="text-neutral-500 text-xs max-w-sm mx-auto leading-relaxed">{error}</p>
        </div>
      ) : sortedPerfumes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100 shadow-sm space-y-4">
          <span className="text-4xl block">{activeCategory === 'favorites' ? "❤️" : "🔍"}</span>
          <h4 className="font-serif text-lg font-bold text-neutral-800">
            {activeCategory === 'favorites' ? "No Saved Favorites Yet" : "No Perfumes Found"}
          </h4>
          <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
            {activeCategory === 'favorites' 
              ? "You haven't saved any perfumes yet. Click the heart icon on any perfume card to add it to your favorites list!" 
              : "We couldn't find any perfumes matching your current filters. Try searching for other notes, or clear your search query!"}
          </p>
          <button
            id="clear-filters-btn"
            onClick={() => { setSearchTerm(""); setActiveCategory('all'); }}
            className="bg-burgundy-800 hover:bg-burgundy-700 text-white px-5 py-2 rounded-full text-xs font-semibold transition"
          >
            {activeCategory === 'favorites' ? "Explore Collections" : "Reset All Filters"}
          </button>
        </div>
      ) : (
        <motion.div
          id="perfumes-grid"
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {sortedPerfumes.map((perfume) => {
              const isAlreadyInCart = cartItemIds.includes(perfume.id);
              const isAddedFeedback = addedFeedbackIds[perfume.id];

              return (
                <motion.div
                  key={perfume.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image & Badges */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
                    <img
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="bg-white/95 text-burgundy-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                        {perfume.brand}
                      </span>
                      <span className="bg-burgundy-800/90 backdrop-blur-xs text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {perfume.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="bg-neutral-900/70 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md font-medium">
                        {perfume.size}
                      </span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        id={`quick-view-overlay-${perfume.id}`}
                        onClick={() => setSelectedPerfume(perfume)}
                        className="bg-white/95 hover:bg-white text-neutral-800 text-xs font-semibold py-2 px-4 rounded-full shadow-lg transition flex items-center gap-1.5 cursor-pointer hover:scale-105"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Scent Notes</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-neutral-400 text-3xs font-semibold uppercase tracking-wider font-mono">
                        <span>{perfume.category}</span>
                        <span>{perfume.vibes[0]}</span>
                      </div>
                      <h4 className="font-serif font-bold text-neutral-900 group-hover:text-burgundy-800 transition duration-200 text-base line-clamp-1">
                        {perfume.name}
                      </h4>
                      <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                        {perfume.description}
                      </p>
                    </div>

                    {/* Scent notes quick badges */}
                    <div className="flex flex-wrap gap-1">
                      {perfume.topNotes.slice(0, 2).map((note) => (
                        <span key={note} className="bg-neutral-50 text-neutral-500 border border-neutral-150 rounded-md px-1.5 py-0.5 text-3xs font-medium">
                          {note}
                        </span>
                      ))}
                      {perfume.baseNotes.slice(0, 1).map((note) => (
                        <span key={note} className="bg-neutral-50 text-burgundy-800 border border-burgundy-100 rounded-md px-1.5 py-0.5 text-3xs font-medium">
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action bar */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <span className="font-serif font-bold text-burgundy-800 text-base">
                        {perfume.priceFormatted}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`favorite-btn-${perfume.id}`}
                          onClick={() => toggleFavorite(perfume.id)}
                          className={`p-2 border rounded-xl transition cursor-pointer ${
                            favorites.includes(perfume.id)
                              ? "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100"
                              : "border-neutral-200 hover:border-neutral-300 text-neutral-400 hover:text-rose-500 hover:bg-rose-50/20"
                          }`}
                          title={favorites.includes(perfume.id) ? "Remove from Favorites" : "Save to Favorites"}
                        >
                          <Heart className={`w-4 h-4 transition-transform duration-200 ${favorites.includes(perfume.id) ? "fill-rose-500 scale-110" : "active:scale-90"}`} />
                        </button>

                        <button
                          id={`quick-view-btn-${perfume.id}`}
                          onClick={() => setSelectedPerfume(perfume)}
                          className="p-2 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
                          title="Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        
                        <button
                          id={`add-to-bag-${perfume.id}`}
                          onClick={() => handleAddWithFeedback(perfume)}
                          className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                            isAddedFeedback
                              ? "bg-emerald-600 text-white"
                              : isAlreadyInCart
                              ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                              : "bg-burgundy-800 hover:bg-burgundy-700 text-white shadow-xs"
                          }`}
                        >
                          {isAddedFeedback ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isAlreadyInCart ? "Add Another" : "Add to Bag"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Scent Notes / Details Dialog Modal */}
      <AnimatePresence>
        {selectedPerfume && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              id="detail-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPerfume(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Modal Sheet */}
            <motion.div
              id="detail-modal-sheet"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row border border-neutral-100 max-h-[90vh] md:max-h-none overflow-y-auto"
            >
              {/* Product Visual */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-neutral-100 shrink-0">
                <img
                  src={selectedPerfume.imageUrl}
                  alt={selectedPerfume.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  id="modal-close-overlay-btn"
                  onClick={() => setSelectedPerfume(null)}
                  className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full md:hidden transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Fragrance Pyramid & Story */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold text-burgundy-800 bg-burgundy-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                      {selectedPerfume.brand}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`modal-favorite-btn-${selectedPerfume.id}`}
                        onClick={() => toggleFavorite(selectedPerfume.id)}
                        className={`p-1.5 border rounded-xl transition cursor-pointer ${
                          favorites.includes(selectedPerfume.id)
                            ? "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-400 hover:text-rose-500 hover:bg-rose-50/20"
                        }`}
                        title={favorites.includes(selectedPerfume.id) ? "Remove from Saved" : "Save Scent"}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-200 ${favorites.includes(selectedPerfume.id) ? "fill-rose-500 scale-110" : ""}`} />
                      </button>
                      <button
                        id="modal-close-desktop-btn"
                        onClick={() => setSelectedPerfume(null)}
                        className="text-neutral-400 hover:text-neutral-600 p-1.5 hover:bg-neutral-100 rounded-full hidden md:block transition cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-neutral-900 text-xl md:text-2xl mt-3">
                    {selectedPerfume.name}
                  </h3>
                  <p className="text-2xs text-neutral-400 font-mono font-semibold uppercase mt-0.5 tracking-wider">
                    {selectedPerfume.type} • {selectedPerfume.size}
                  </p>

                  <p className="text-neutral-500 text-xs mt-3 leading-relaxed">
                    {selectedPerfume.description}
                  </p>

                  {/* Scent Pyramid Grid */}
                  <div className="mt-5 space-y-3.5 pt-4 border-t border-neutral-100">
                    <h5 className="font-serif text-2xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>The Olfactory Pyramid</span>
                    </h5>

                    <div className="space-y-2.5 text-xs">
                      {/* Top Notes */}
                      <div className="flex gap-4">
                        <span className="w-20 font-bold text-burgundy-800 font-mono uppercase text-3xs tracking-wider shrink-0 mt-0.5">Top Notes</span>
                        <p className="text-neutral-600 text-xs leading-normal">
                          {selectedPerfume.topNotes.join(", ")}
                        </p>
                      </div>

                      {/* Heart Notes */}
                      <div className="flex gap-4">
                        <span className="w-20 font-bold text-neutral-700 font-mono uppercase text-3xs tracking-wider shrink-0 mt-0.5">Heart Notes</span>
                        <p className="text-neutral-600 text-xs leading-normal">
                          {selectedPerfume.middleNotes.join(", ")}
                        </p>
                      </div>

                      {/* Base Notes */}
                      <div className="flex gap-4">
                        <span className="w-20 font-bold text-gold-700 font-mono uppercase text-3xs tracking-wider shrink-0 mt-0.5">Base Notes</span>
                        <p className="text-neutral-600 text-xs leading-normal">
                          {selectedPerfume.baseNotes.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vibes */}
                  <div className="mt-5">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPerfume.vibes.map((v) => (
                        <span key={v} className="bg-neutral-100 text-neutral-600 rounded-md px-2 py-0.5 text-3xs font-mono font-medium">
                          #{v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buy Block */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-3xs text-neutral-400 font-medium">Affordable Price</span>
                    <span className="text-xl font-serif font-bold text-burgundy-800">{selectedPerfume.priceFormatted}</span>
                  </div>

                  <button
                    id={`modal-add-to-bag-${selectedPerfume.id}`}
                    onClick={() => {
                      handleAddWithFeedback(selectedPerfume);
                    }}
                    className={`flex-1 py-3 px-6 rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                      addedFeedbackIds[selectedPerfume.id]
                        ? "bg-emerald-600 text-white"
                        : "bg-burgundy-800 hover:bg-burgundy-700 text-white"
                    }`}
                  >
                    {addedFeedbackIds[selectedPerfume.id] ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3px]" />
                        <span>Added to Scent Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Scent Bag</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
