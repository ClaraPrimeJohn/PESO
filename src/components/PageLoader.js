import { useState, useEffect } from "react";

const PageLoader = ({ children, isLoading }) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setFadeOut(true), 200); 
      setTimeout(() => setLoading(false), 800); 
    }
  }, [isLoading]);

  if (!mounted || loading) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-100 z-50 transition-opacity duration-700 ease-in-out ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue"></div>
      </div>
    );
  }

  return children;
};

export default PageLoader;
