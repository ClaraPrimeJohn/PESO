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
  const [announcementsPerPage] = useState(5);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching announcements:", error);
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

  const filteredAnnouncements = applyFilters();
  
  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  const PaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue/10'
          }`}
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`min-w-[2rem] h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                number === currentPage
                  ? 'bg-blue text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue/10'
          }`}
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-y-auto">
      <PageLoader>
      <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 text-center py-8 my-4 mx-4 sm:mx-8 md:mx-18 lg:mx-32">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl sm:text-2xl font-bold text-darkblue mb-4 break-words">PESO Announcements</h3>
              <p className="text-gray-700 text-sm mb-6">
                Stay informed with the latest announcements from the Public Employment Service Office (PESO).
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="font-semibold text-base mb-2">Search Announcements</h2>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title, description, or location"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-base mb-2">Filter by Month</h2>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
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
                  <h2 className="font-semibold text-base mb-2">Filter by Location</h2>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-blue hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Clear Filters
                </button>

                <div className="text-sm text-gray-600">
                  Showing {filteredAnnouncements.length} of {announcements.length} announcements
                </div>

                <div className="hidden lg:block space-y-4 mt-6">
                  <h4 className="text-lg font-semibold text-darkblue">What's New at PESO?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>📅 Check out upcoming events such as job fairs and workshops</li>
                    <li>💼 Explore new job opportunities posted daily</li>
                    <li>🎓 Stay updated on free training programs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-700">
                Showing <span className="font-bold">{currentAnnouncements.length}</span> of{" "}
                <span className="font-bold">{filteredAnnouncements.length}</span> announcements
              </div>
            </div>

            {currentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white shadow-sm border rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-md duration-300 ease-out mb-6"
              >
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-500 text-left">
                    {new Date(announcement.date.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <h1 className="text-xl font-bold text-left text-darkblue pt-2 mb-4">
                    {announcement.title}
                  </h1>
                  <p className="text-gray-700 mb-4 text-base text-left leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
                    {announcement.description}
                  </p>
                  <p className="text-gray-700 mb-4 text-sm text-left">
                    <strong className="text-darkblue">Location:</strong>{" "}
                    {announcement.location}
                  </p>
                </div>
              </div>
            ))}

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No announcements found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue hover:text-darkblue underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
            <PaginationControls />
          </div>
        </div> 
      </div>
      </PageLoader>
      </div>
  );
};

export default Announcement;