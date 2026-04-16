let loadPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    // Callback нэр — global-д тавина
    const callbackName = '__googleMapsInit__';

    (window as Record<string, unknown>)[callbackName] = () => {
      delete (window as Record<string, unknown>)[callbackName];
      console.log('✅ Google Maps Places ачаалагдлаа');
      resolve();
    };

    const script = document.createElement('script');
    // callback= параметр ашиглавал loading=async хэрэггүй
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=sv&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loadPromise = null;
      delete (window as Record<string, unknown>)[callbackName];
      console.error('❌ Google Maps ачаалагдсангүй. API key болон API restrictions шалгана уу.');
      reject(new Error('Google Maps failed to load'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}
