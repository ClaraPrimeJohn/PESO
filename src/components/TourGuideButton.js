import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

const TourGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Define constant values
  const MARGIN = 15; // Minimum margin from screen edge
  const TOOLTIP_HEIGHT = 150; // Approximate tooltip height

  // Define all the steps in the tour with useMemo to prevent recreation on every render
  const tourSteps = useMemo(() => [
    {
      selector: '.search-bar', 
      title: 'Search Jobs',
      content: 'Enter keywords like job titles or company names to find matching positions.',
      position: 'bottom'
    },
    {
      selector: 'button:has(> .filter-icon)', 
      title: 'Advanced Filters',
      content: 'Click here to open filters for job type, experience level, and posting date.',
      position: 'bottom'
    },
    {
      selector: '.view-controls', 
      title: 'Change View',
      content: 'Switch between list and grid views to browse jobs differently.',
      position: 'bottom'
    },
    {
      selector: '.sort-dropdown', 
      title: 'Sort Jobs',
      content: 'Arrange jobs by latest, oldest, or relevance to your search.',
      position: 'bottom'
    },
    {
      selector: '.apply-button', 
      title: 'Apply for Jobs',
      content: 'Click this button to apply for positions that interest you.',
      position: 'left'
    },
    {
      selector: '.pagination-controls',
      title: 'Navigate Pages',
      content: 'Use these controls to browse through all available job listings.',
      position: 'top'
    }
  ], []); 

 
  const determineOptimalPosition = useCallback((rect, preferredPosition) => {
    const tooltipWidth = Math.min(300, windowSize.width * 0.8); 
    

    switch (preferredPosition) {
      case 'bottom':
        if (rect.bottom + TOOLTIP_HEIGHT + MARGIN > windowSize.height) {
          // Not enough space at bottom, try top
          if (rect.top - TOOLTIP_HEIGHT - MARGIN > 0) {
            return 'top';
          } else {
            // Try left or right
            return rect.left > windowSize.width / 2 ? 'left' : 'right';
          }
        }
        break;
      case 'top':
        if (rect.top - TOOLTIP_HEIGHT - MARGIN < 0) {
          // Not enough space at top, try bottom
          if (rect.bottom + TOOLTIP_HEIGHT + MARGIN < windowSize.height) {
            return 'bottom';
          } else {
            // Try left or right
            return rect.left > windowSize.width / 2 ? 'left' : 'right';
          }
        }
        break;
      case 'left':
        if (rect.left - tooltipWidth - MARGIN < 0) {
          // Not enough space at left, try right
          if (rect.right + tooltipWidth + MARGIN < windowSize.width) {
            return 'right';
          } else {
            // Try top or bottom
            return rect.top > windowSize.height / 2 ? 'top' : 'bottom';
          }
        }
        break;
      case 'right':
        if (rect.right + tooltipWidth + MARGIN > windowSize.width) {
          // Not enough space at right, try left
          if (rect.left - tooltipWidth - MARGIN > 0) {
            return 'left';
          } else {
            // Try top or bottom
            return rect.top > windowSize.height / 2 ? 'top' : 'bottom';
          }
        }
        break;
      default:
        break;
    }
    
    return preferredPosition; // Return original if no issues
  }, [windowSize]);

  // Update highlight position on resize or scroll
  const updateHighlightPosition = useCallback(() => {
    if (currentStep >= 0 && currentStep < tourSteps.length) {
      const element = document.querySelector(tourSteps[currentStep].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const position = determineOptimalPosition(rect, tourSteps[currentStep].position);
        
        setHighlightPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          position: position,
          // Store these for calculating absolute position
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
      }
    }
  }, [currentStep, tourSteps, determineOptimalPosition]);

  // Track window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateHighlightPosition);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateHighlightPosition);
    };
  }, [updateHighlightPosition]);

  // Update highlight when step changes or window resizes
  useEffect(() => {
    updateHighlightPosition();
  }, [currentStep, updateHighlightPosition, windowSize]);

  // Scroll element into view when step changes
  useEffect(() => {
    const element = document.querySelector(tourSteps[currentStep]?.selector);
    if (element) {
      // Use a small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Update position after scrolling completes
        setTimeout(updateHighlightPosition, 500);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, tourSteps, updateHighlightPosition]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  // If no highlight position is set yet, don't render
  if (!highlightPosition) return null;

  // Calculate tooltip position based on the highlighted element
  let tooltipStyle = {};
  const offset = Math.min(15, windowSize.width * 0.03); // Responsive offset
  const tooltipWidth = Math.min(300, windowSize.width * 0.8); // Responsive width
  
  // Ensure the tooltip stays within viewport boundaries
  switch (highlightPosition.position) {
    case 'bottom':
      tooltipStyle = {
        top: highlightPosition.top + highlightPosition.height + offset,
        left: Math.max(
          MARGIN,
          Math.min(
            highlightPosition.left + (highlightPosition.width / 2) - (tooltipWidth / 2),
            windowSize.width - tooltipWidth - MARGIN
          )
        ),
        width: tooltipWidth
      };
      break;
    case 'top':
      tooltipStyle = {
        top: Math.max(MARGIN, highlightPosition.top - offset - 150),
        left: Math.max(
          MARGIN,
          Math.min(
            highlightPosition.left + (highlightPosition.width / 2) - (tooltipWidth / 2),
            windowSize.width - tooltipWidth - MARGIN
          )
        ),
        width: tooltipWidth
      };
      break;
    case 'left':
      tooltipStyle = {
        top: Math.max(
          MARGIN,
          Math.min(
            highlightPosition.top + (highlightPosition.height / 2) - 75,
            windowSize.height - 150 - MARGIN
          )
        ),
        left: Math.max(MARGIN, highlightPosition.left - offset - tooltipWidth),
        width: tooltipWidth
      };
      break;
    case 'right':
      tooltipStyle = {
        top: Math.max(
          MARGIN,
          Math.min(
            highlightPosition.top + (highlightPosition.height / 2) - 75,
            windowSize.height - 150 - MARGIN
          )
        ),
        left: Math.min(
          windowSize.width - tooltipWidth - MARGIN,
          highlightPosition.left + highlightPosition.width + offset
        ),
        width: tooltipWidth
      };
      break;
    default:
      tooltipStyle = {
        top: highlightPosition.top + highlightPosition.height + offset,
        left: Math.max(
          MARGIN,
          Math.min(
            highlightPosition.left + (highlightPosition.width / 2) - (tooltipWidth / 2),
            windowSize.width - tooltipWidth - MARGIN
          )
        ),
        width: tooltipWidth
      };
  }

  return createPortal(
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={skipTour}
      />

      {/* Highlighted element cutout */}
      <div
        className="fixed z-50 border-2 border-blue rounded-md shadow-lg pointer-events-none"
        style={{
          top: highlightPosition.top - 4,
          left: highlightPosition.left - 4,
          width: highlightPosition.width + 8,
          height: highlightPosition.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed bg-white rounded-lg shadow-xl z-50 p-4"
        style={tooltipStyle}
      >
        <h3 className="text-lg font-bold text-blue mb-2">{tourSteps[currentStep].title}</h3>
        <p className="text-black-secondary mb-4">{tourSteps[currentStep].content}</p>
        
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex space-x-2">
            <button
              onClick={prevStep}
              className={`p-2 rounded ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue hover:bg-blue-50'}`}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="p-2 bg-blue text-white rounded hover:bg-darkblue"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {currentStep + 1} / {tourSteps.length}
          </div>
          
          <button
            onClick={skipTour}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tour
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

// Help button that triggers the tour
const TourGuideButton = () => {
  const [isTourActive, setIsTourActive] = useState(false);

  const startTour = () => {
    setIsTourActive(true);
  };

  return (
    <>
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 bg-blue text-white p-3 rounded-full shadow-lg hover:bg-darkblue transition-all duration-300 z-40"
        title="Start guided tour"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {isTourActive && <TourGuide onClose={() => setIsTourActive(false)} />}
    </>
  );
};

export default TourGuideButton;