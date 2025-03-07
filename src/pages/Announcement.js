import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PageLoader from "../components/PageLoader"; 

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "announcements"));
        const fetchedAnnouncements = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedAnnouncements = fetchedAnnouncements.sort((a, b) => {
          return b.date.seconds - a.date.seconds;
        });

        const uniqueLocations = [...new Set(fetchedAnnouncements.map(ann => ann.location))];
        setLocations(uniqueLocations);
        setAnnouncements(sortedAnnouncements);
        
        // Let the PageLoader handle the transition
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const applyFilters = () => {
    return announcements.filter((announcement) => {
      const announcementDate = new Date(announcement.date.seconds * 1000);
      const announcementMonth = announcementDate.toLocaleString("default", { month: "long" });

      const matchesSearch = searchTerm === "" ||
        announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMonth = selectedMonth === "" || announcementMonth === selectedMonth;

      const matchesLocation = selectedLocation === "" || announcement.location === selectedLocation;

      return matchesSearch && matchesMonth && matchesLocation;
    });
  };

  const groupAnnouncementsByMonthYear = (announcements) => {
    const grouped = {};

    announcements.forEach(announcement => {
      const date = new Date(announcement.date.seconds * 1000);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(announcement);
    });

    // Sort the groups by date (most recent first)
    return Object.entries(grouped)
      .sort(([keyA], [keyB]) => {
        const [monthA, yearA] = keyA.split(' ');
        const [monthB, yearB] = keyB.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateB - dateA;
      });
  };

  const filteredAnnouncements = applyFilters();
  const groupedAnnouncements = groupAnnouncementsByMonthYear(filteredAnnouncements);

  // Pagination for grouped announcements
  const indexOfLastGroup = currentPage * announcementsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - announcementsPerPage;

  // Flatten the grouped announcements for pagination
  const flattenedAnnouncements = groupedAnnouncements.flatMap(([group, announcements]) =>
    announcements.map(announcement => ({ ...announcement, group }))
  );

  const currentAnnouncements = flattenedAnnouncements.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(flattenedAnnouncements.length / announcementsPerPage);

  // Regroup the current page announcements
  const regroupCurrentAnnouncements = () => {
    const grouped = {};

    currentAnnouncements.forEach(announcement => {
      if (!grouped[announcement.group]) {
        grouped[announcement.group] = [];
      }

      grouped[announcement.group].push(announcement);
    });

    return Object.entries(grouped);
  };

  const currentGroupedAnnouncements = regroupCurrentAnnouncements();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const formatDate = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    document.body.style.overflow = 'auto';
  };
 
  const AnnouncementModal = ({ announcement, onClose }) => {
    useEffect(() => {
      if (announcement) {
        const handleEsc = (event) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }
    }, [onClose, announcement]);

    if (!announcement) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl transform transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="pr-6">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue bg-opacity-10 text-blue">
                  {formatDate(announcement.date.seconds)}
                </div>
                <h2 className="text-2xl font-bold text-darkblue mt-2">{announcement.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-black-secondary hover:text-black-primary rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
              </button>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center text-sm text-gray-secondary mb-4 bg-gray-100 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {announcement.location}
              </div>
              <div className="prose max-w-none text-black-primary whitespace-pre-wrap leading-relaxed">
                {announcement.description}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLoader isLoading={loading}>
      <div className="min-h-screen">
        <div className="w-full py-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Updated Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 sticky top-36">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue rounded-lg p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-darkblue break-words">PESO Announcements</h3>
                </div>
                
                <p className="text-gray-secondary text-sm mb-8 leading-relaxed">
                  Stay informed with the latest announcements from the Public Employment Service Office (PESO).
                </p>

                <div className="hidden lg:block space-y-4 my-8 bg-blue bg-opacity-5 p-4 rounded-lg border border-blue border-opacity-20">
                  <h4 className="font-medium text-darkblue flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What's New at PESO?
                  </h4>
                  <ul className="space-y-2 text-sm text-black-primary">
                    <li className="flex items-start">
                      <span className="mr-2">📅</span>
                      <span>Check out upcoming events such as job fairs and workshops</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">💼</span>
                      <span>Explore new job opportunities posted daily</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🎓</span>
                      <span>Stay updated on free training programs</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="font-medium mb-3 text-black-secondary flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Announcements
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search by title or description"
                        className="w-full bg-gray-50 p-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-medium mb-3 text-black-secondary flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Filter by Month
                    </h2>
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-gray-50 p-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue appearance-none"
                      >
                        <option value="">All Months</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg className="h-4 w-4 text-gray-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-medium mb-3 text-black-secondary flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Filter by Location
                    </h2>
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => {
                          setSelectedLocation(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-gray-50 p-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue appearance-none"
                      >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg className="h-4 w-4 text-gray-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* <button
                    onClick={clearFilters}
                    className="w-full bg-blue border border-gray-300 hover:bg-darkblue text-white py-3 text-sm rounded-lg transition font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button> */}
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="flex items-center justify-between my-4">
                <div className="text-black-primary bg-white px-4 py-2 rounded-lg shadow-sm border border-neutral-200">
                  <span className="font-bold text-blue">{filteredAnnouncements.length}</span> announcements found
                  {(searchTerm || selectedMonth || selectedLocation) && (
                    <span className="ml-1">with current filters</span>
                  )}
                </div>
                
                {(searchTerm || selectedMonth || selectedLocation) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm text-blue hover:text-darkblue"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>

              {/* Announcements Grid with content fade in */}
              <div className="transition-opacity duration-500 ease-in-out opacity-100">
                {filteredAnnouncements.length > 0 ? (
                  <div className="mb-8 space-y-12">
                    {currentGroupedAnnouncements.map(([monthYear, groupAnnouncements]) => (
                      <div key={monthYear} className="mb-8">
                        <div className="relative mb-8">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-start">
                            <span className="px-4 py-2 bg-blue text-white text-lg font-semibold rounded-lg shadow-sm">
                              {monthYear}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupAnnouncements.map((announcement) => (
                            <div
                              key={announcement.id}
                              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] cursor-pointer h-full flex flex-col group"
                              onClick={() => openModal(announcement)}
                            >
                              <div className="p-5 flex-grow">
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue bg-opacity-10 text-blue mb-3">
                                  {formatDate(announcement.date.seconds)}
                                </div>
                                <h3 className="text-lg font-bold text-darkblue mb-3 group-hover:text-blue transition-colors">{announcement.title}</h3>
                                <p className="text-black-primary mb-4 line-clamp-3 text-sm leading-relaxed">{announcement.description}</p>
                                <div className="inline-flex items-center text-sm text-black-pr bg-gray-100 px-2 py-1 rounded-full">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  </svg>
                                  {announcement.location}
                                </div>
                              </div>
                              <div className="bg-gray-50 px-5 py-3 mt-auto border-t border-neutral-200">
                                <button
                                  className="text-blue hover:text-darkblue text-sm font-medium flex items-center transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(announcement);
                                  }}
                                >
                                  Read more
                                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-200">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-black-primary">No announcements found</h3>
                    <p className="mt-2 text-sm text-gray-secondary">Try adjusting your filters to find what you're looking for.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-6 px-4 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {!loading && filteredAnnouncements.length > announcementsPerPage && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-3 border-r border-neutral-200 transition ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-black-primary hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`w-10 h-10 flex items-center justify-center border-r border-neutral-200 transition font-medium ${i + 1 === currentPage ? 'bg-blue text-white' : 'text-black-primary hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-3 transition ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-black-primary hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcement Modal */}
        {isModalOpen && (
          <AnnouncementModal
            announcement={selectedAnnouncement}
            onClose={closeModal}
          />
        )}
      </div>
    </PageLoader>
  );
};

export default Announcement;