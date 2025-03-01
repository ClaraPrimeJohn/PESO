import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { DotLoader } from "react-spinners";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setFadeOut(false);
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
        
        // Start fade out transition
        setFadeOut(true);
        // Complete the loading state change after animation
        setTimeout(() => setLoading(false), 600);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setFadeOut(true);
        setTimeout(() => setLoading(false), 600);
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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Modal component
  const AnnouncementModal = ({ announcement, onClose }) => {
    if (!announcement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-secondary">{formatDate(announcement.date.seconds)}</p>
                <h2 className="text-2xl font-bold text-darkblue mt-2">{announcement.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-black-secondary hover:text-black-primary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-secondary mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {announcement.location}
              </div>
              <div className="prose max-w-none">
                <p className="text-black-primary whitespace-pre-wrap">{announcement.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6 sm:py-8 my-6 mx-auto">
        {/* <h1 className="text-3xl font-bold mb-6 text-black-secondary">Announcements</h1> */}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Updated Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-300">
              <h3 className="text-xl sm:text-2xl font-bold text-darkblue mb-2 break-words">PESO Announcements</h3>
              <p className="text-gray-secondary text-sm mb-6">
                Stay informed with the latest announcements from the Public Employment Service Office (PESO).
              </p>

              <div className="hidden lg:block space-y-3 my-8">
                <h4 className="font-medium text-black-secondary">What's New at PESO?</h4>
                <ul className="space-y-1 text-sm text-black-primary">
                  <li>📅 Check out upcoming events such as job fairs and workshops</li>
                  <li>💼 Explore new job opportunities posted daily</li>
                  <li>🎓 Stay updated on free training programs</li>
                </ul>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="font-medium mb-2 text-black-secondary">Search Announcements</h2>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title, description, or location"
                    className="w-full bg-white p-1 sm:p-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black-secondary"
                  />
                </div>

                <div>
                  <h2 className="font-medium mb-2 text-black-secondary">Filter by Month</h2>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white p-1 sm:p-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black-secondary"
                  >
                    <option value="">All Months</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h2 className="font-medium mb-2 text-black-secondary">Filter by Location</h2>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white p-1 sm:p-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black-secondary"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-blue hover:bg-darkblue text-white py-2 text-sm rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="mb-4 text-black-primary">
              Showing <span className="font-bold">{currentAnnouncements.length}</span> of{" "}
              <span className="font-bold">{filteredAnnouncements.length}</span> announcements
            </div>

            {/* Announcements Grid with smooth loader transition */}
            {loading ? (
              <div 
                className={`flex justify-center items-center h-64 transition-opacity duration-600 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
              >
                <DotLoader color="#1E40AF" size={60} speedMultiplier={1} />
              </div>
            ) : (
              <div className="transition-opacity duration-600 ease-in-out opacity-100">
                {filteredAnnouncements.length > 0 ? (
                  <div className="mb-8">
                    {currentGroupedAnnouncements.map(([monthYear, groupAnnouncements]) => (
                      <div key={monthYear} className="mb-8">
                        <h2 className="text-xl font-bold text-black-secondary mb-4 pb-2">
                          {monthYear}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupAnnouncements.map((announcement) => (
                            <div
                              key={announcement.id}
                              className="bg-white rounded-lg shadow-sm border border-neutral-300 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                              onClick={() => openModal(announcement)}
                            >
                              <div className="p-4 flex-grow">
                                <div className="text-sm text-gray-secondary mb-2">
                                  {formatDate(announcement.date.seconds)}
                                </div>
                                <h3 className="text-lg font-semibold text-darkblue mb-2">{announcement.title}</h3>
                                <p className="text-black-primary mb-3 line-clamp-2">{announcement.description}</p>
                                <div className="flex items-center text-sm text-gray-secondary">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  </svg>
                                  {announcement.location}
                                </div>
                              </div>
                              <div className="px-4 pb-3 mt-auto">
                                <button
                                  className="text-blue hover:text-darkblue text-sm font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(announcement);
                                  }}
                                >
                                  Read more →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-neutral-300">
                    <p className="text-black-primary">No announcements found matching your filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-blue hover:text-darkblue underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {!loading && filteredAnnouncements.length > announcementsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition ${currentPage === 1 ? 'text-gray-secondary cursor-not-allowed' : 'text-black-primary hover:bg-black-primary hover:bg-opacity-10'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded transition ${i + 1 === currentPage ? 'bg-blue text-white' : 'text-black-primary hover:bg-black-primary hover:bg-opacity-10'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition ${currentPage === totalPages ? 'text-gray-secondary cursor-not-allowed' : 'text-black-primary hover:bg-black-primary hover:bg-opacity-10'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
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
  );
};

export default Announcement;