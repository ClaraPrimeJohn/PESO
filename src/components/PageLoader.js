import { useState, useEffect } from "react";

const PageLoader = ({ children, isLoading }) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
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
      setTimeout(() => {
        setLoading(false);
        // Start fade-in effect once loader is gone
        setTimeout(() => setFadeIn(true), 50);
      }, 500); 
    }
  }, [isLoading]);

  return (
    <>
      {(!mounted || loading) && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-100 z-50 transition-opacity duration-500 ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue"></div>
        </div>
      )}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PageLoader;