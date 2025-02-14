import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

        setAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = selectedMonth === "All"
    ? announcements
    : announcements.filter((announcement) => {
      const announcementDate = new Date(announcement.date.seconds * 1000);
      const announcementMonth = announcementDate.toLocaleString("default", { month: "long" });
      return announcementMonth === selectedMonth;
    });

  const filteredByCategory = filteredAnnouncements.filter((announcement) => {
    return selectedCategory === "All" || announcement.category === selectedCategory;
  });

  const groupedAnnouncements = filteredByCategory.reduce((groups, announcement) => {
    const announcementDate = new Date(announcement.date.seconds * 1000);
    const month = announcementDate.toLocaleString("default", { month: "long", year: "numeric" });

    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(announcement);
    return groups;
  }, {});

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const months = Array.from(
    new Set(
      announcements.map((announcement) =>
        new Date(announcement.date.seconds * 1000).toLocaleString("default", { month: "long" })
      )
    )
  ).sort();

  return (
    <div className="bg-white py-16 lg:px-32 md:px-32 px-8 flex">
      <div className="w-1/4 pr-8 hidden lg:block">
        <div className="bg-gray-100 p-6 shadow-sm border rounded-lg space-y-6">
          <h3 className="text-2xl font-bold text-darkblue mb-4">PESO Announcements</h3>
          <p className="text-gray-700 text-sm mb-4">
            Stay informed with the latest announcements from the Public Employment Service Office (PESO). This section contains important updates about job opportunities, public service programs, and events. Filter and search for announcements to easily find the information that matters to you.
          </p>
       
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Search Announcements</label>
            <input
              type="text"
              placeholder="Search by title or keywords..."
              className="border rounded-lg p-2 w-full text-gray-700"
            />
          </div>
       
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              onChange={handleCategoryChange}
              className="border rounded-lg p-2 w-full text-gray-700"
            >
              <option value="All">All Categories</option>
              <option value="Jobs">Job Listings</option>
              <option value="Events">Events</option>
              <option value="Training">Training Programs</option>
              <option value="PublicServices">Public Services</option>
            </select>
          </div>
     
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Filter by Month</label>
            <select
              onChange={handleMonthChange}
              value={selectedMonth}
              className="border rounded-lg p-2 w-full text-gray-700"
            >
              <option value="All">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
       
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-darkblue">What’s New at PESO?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📅 Check out upcoming events such as job fairs, workshops, and community outreach programs.</li>
              <li>💼 Explore new job opportunities posted daily by local employers.</li>
              <li>🎓 Stay updated on free training and skills development programs available to the public.</li>
            </ul>
          </div>
         
          <div className="mt-6">
            <a
              href="/ewan"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Learn more about PESO services
            </a>
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
