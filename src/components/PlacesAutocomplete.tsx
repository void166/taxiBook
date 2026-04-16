import { useEffect, useRef, useState, useCallback } from 'react';

interface Suggestion {
  place_id: string;
  description: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dotColor?: string;
  className?: string;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  placeholder = 'Хаяг хайх...',
  dotColor = '#9ca3af',
  className = '',
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // AutocompleteService — Google Maps ачаалагдсаны дараа үүснэ
  useEffect(() => {
    const init = () => {
      if (window.google?.maps?.places?.AutocompleteService) {
        serviceRef.current = new google.maps.places.AutocompleteService();
      }
    };
    init();
    if (!serviceRef.current) {
      const id = setInterval(() => { init(); if (serviceRef.current) clearInterval(id); }, 300);
      return () => clearInterval(id);
    }
  }, []);

  const fetchSuggestions = useCallback((input: string) => {
    if (!serviceRef.current || input.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      },
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 300);
  };

  const handleSelect = (description: string) => {
    onChange(description);
    setSuggestions([]);
    setOpen(false);
  };

  const handleBlur = () => {
    // onMouseDown дуусахыг хүлээнэ
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dot */}
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />

      {/* Input + dropdown */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onBlur={handleBlur}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full font-bold text-sm text-gray-900 placeholder:text-gray-400 placeholder:font-normal outline-none bg-transparent"
        />

        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-[-52px] right-0 bg-white rounded-2xl shadow-xl border border-gray-100 mt-2 z-[9999] overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={s.place_id}
                type="button"
                onMouseDown={() => handleSelect(s.description)}
                className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#fef9e7] hover:text-gray-900 transition-colors flex items-start gap-3 ${
                  i < suggestions.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <span className="text-gray-300 mt-0.5 flex-shrink-0">📍</span>
                <span className="leading-snug">{s.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
