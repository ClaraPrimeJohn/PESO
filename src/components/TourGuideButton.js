import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

const TourGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const MARGIN = 15; // min margin from screen edge
  const TOOLTIP_HEIGHT = 150; // tooltip height para di lagpas pag responsive

  // all steps with classname selector (double check invokers)
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
    
    // hehe nagamit ko din switch (ayaw ng ibang dev toh eh) 
    // context find enough space to cover responsiveness para di putol pag na invoke tooltip
    switch (preferredPosition) {
      case 'bottom':
        if (rect.bottom + TOOLTIP_HEIGHT + MARGIN > windowSize.height) {
          if (rect.top - TOOLTIP_HEIGHT - MARGIN > 0) {
            return 'top';
          } else {
            return rect.left > windowSize.width / 2 ? 'left' : 'right';
          }
        }
        break;
      case 'top':
        if (rect.top - TOOLTIP_HEIGHT - MARGIN < 0) {
          if (rect.bottom + TOOLTIP_HEIGHT + MARGIN < windowSize.height) {
            return 'bottom';
          } else {
            return rect.left > windowSize.width / 2 ? 'left' : 'right';
          }
        }
        break;
      case 'left':
        if (rect.left - tooltipWidth - MARGIN < 0) {
          if (rect.right + tooltipWidth + MARGIN < windowSize.width) {
            return 'right';
          } else {
            return rect.top > windowSize.height / 2 ? 'top' : 'bottom';
          }
        }
        break;
      case 'right':
        if (rect.right + tooltipWidth + MARGIN > windowSize.width) {
          if (rect.left - tooltipWidth - MARGIN > 0) {
            return 'left';
          } else {
            return rect.top > windowSize.height / 2 ? 'top' : 'bottom';
          }
        }
        break;
      default:
        break;
    }
    
    return preferredPosition; 
  }, [windowSize]);

  // move highlight with screeb positiion mapping currentstep with highlighted divs so it follows screen position
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
          scrollY: window.scrollY, // for precision when scrolling
          scrollX: window.scrollX  // also this
        });
      }
    }
  }, [currentStep, tourSteps, determineOptimalPosition]);

  // for resize kasi may issue sa mga devices eh area lang compute 
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

  // update position of blue highlight
  useEffect(() => {
    updateHighlightPosition();
  }, [currentStep, updateHighlightPosition, windowSize]);

  // scroll to div
  useEffect(() => {
    const element = document.querySelector(tourSteps[currentStep]?.selector);
    if (element) {
      const timer = setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // smooth transtion when nexting
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

 
  if (!highlightPosition) return null;

  // computation of tooltip position referenced at top - customize if necessary
  let tooltipStyle = {};
  const offset = Math.min(15, windowSize.width * 0.03);  
  const tooltipWidth = Math.min(300, windowSize.width * 0.8); 
  
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

// invoke tour
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