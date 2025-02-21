import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  // const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [locations, setLocations] = useState([]);

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

  const filterAnnouncements = (announcements) => {
    return announcements.filter(announcement => {

      const monthMatch = selectedMonth === "All" || 
        new Date(announcement.date.seconds * 1000).toLocaleString("default", { month: "long" }) === selectedMonth;

      // const categoryMatch = selectedCategory === "All" || announcement.category === selectedCategory; 

      const locationMatch = selectedLocation === "All" || announcement.location === selectedLocation;
      const searchMatch = !searchTerm || 
        announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.id?.toLowerCase().includes(searchTerm.toLowerCase());

      return monthMatch && locationMatch && searchMatch;
    });
  };

  // Apply all filters
  const filteredAnnouncements = filterAnnouncements(announcements);

  // Group announcements by month after filtering
  const groupedAnnouncements = filteredAnnouncements.reduce((groups, announcement) => {
    const announcementDate = new Date(announcement.date.seconds * 1000);
    const month = announcementDate.toLocaleString("default", { month: "long", year: "numeric" });

    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(announcement);
    return groups;
  }, {});

  const months = Array.from(
    new Set(
      announcements.map((announcement) =>
        new Date(announcement.date.seconds * 1000).toLocaleString("default", { month: "long" })
      )
    )
  ).sort();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMonth("All");
    // setSelectedCategory("All");
    setSelectedLocation("All");
  };

  return (
    <div className="bg-white py-16 lg:px-32 md:px-32 px-8 flex">
      <div className="w-1/4 pr-8 hidden lg:block">
        <div className="bg-gray-100 p-6 shadow-sm border rounded-lg space-y-6">
          <h3 className="text-2xl font-bold text-darkblue mb-4">PESO Announcements</h3>
          <p className="text-gray-700 text-sm mb-4">
            Stay informed with the latest announcements from the Public Employment Service Office (PESO).
          </p>
       
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Search Announcements</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by title, description, or ID..."
              className="border rounded-lg p-2 w-full text-gray-700"
            />
          </div>
       
          {/* <div className="mb-6">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg p-2 w-full text-gray-700"
            >
              <option value="All">All Categories</option>
              <option value="Jobs">Job Listings</option>
              <option value="Events">Events</option>
              <option value="Training">Training Programs</option>
              <option value="PublicServices">Public Services</option>
            </select>
          </div> */}
     
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Filter by Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-lg p-2 w-full text-gray-700"
            >
              <option value="All">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Filter by Location</label>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="border rounded-lg p-2 w-full text-gray-700"
            >
              <option value="All">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="w-full bg-blue text-white py-2 rounded-lg hover:bg-darkblue transition-colors"
          >
            Clear Filters
          </button>
         
          <div className="mt-6">
            <div className="text-sm text-gray-600">
              Showing {filteredAnnouncements.length} of {announcements.length} announcements
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4">
        <div className="max-w-8xl mx-auto">
          {Object.entries(groupedAnnouncements).map(([month, announcements]) => (
            <div key={month} className="mb-12">
              <h2 className="text-xl font-bold text-darkblue mb-4">{month}</h2>
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white shadow-sm border rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:scale-10 hover:shadow-md duration-300 ease-out mb-6">
                  <div className="px-8 py-4">
                    <p className="text-sm text-gray-500 text-right">
                      {new Date(announcement.date.seconds * 1000).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                   
                    <h1 className="text-xl font-bold text-darkblue pt-2 mb-4">
                      {announcement.title}
                    </h1>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
                      {announcement.description}
                    </p>
                    <p className="text-gray-700 mb-4 text-sm">
                      <strong className="text-darkblue">Location:</strong>{" "}
                      {announcement.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;