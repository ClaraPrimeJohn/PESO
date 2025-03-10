import { useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import history from "../assets/history.webp";
import history1 from "../assets/history1.webp";
import history2 from "../assets/history2.webp";

const PESOHistory = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-x-0");
            entry.target.classList.remove("opacity-0", "-translate-x-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const timelineData = [
    {
      period: "2000 - 2005",
      date: "November 13, 2000",
      title: "Foundation of PESO",
      description:
        "PESO was formally established to provide employment services to the community. It started with a few job matching programs and career guidance sessions.",
      image: history,
      milestones: [
        "Initiated job matching programs",
        "Launched initial career guidance services",
        "Established community employment support",
      ],
    },
    {
      period: "2005 - 2010",
      date: "March 8, 2006",
      title: "Service Expansion",
      description:
        "Expansion of PESO services, including skills training and overseas employment assistance, to cater to more job seekers.",
      image: history1,
      milestones: [
        "Introduced skills training programs",
        "Developed overseas employment assistance",
        "Broadened job seeker support network",
      ],
    },
    {
      period: "2010 - 2015",
      date: "July 22, 2012",
      title: "Digital Transformation",
      description:
        "PESO adopted digital employment facilitation, introducing an online job-matching system to improve accessibility for job seekers and employers.",
      image: history2,
      milestones: [
        "Launched online job-matching platform",
        "Enhanced digital employment services",
        "Improved accessibility for job seekers",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
      <div className="w-full mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 pb-4 border-b-4 border-blue">
          Our Evolutionary Journey
        </h2>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue/30 h-full z-0"></div>

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`timeline-item flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center mb-16 opacity-0 -translate-x-10 transition-all duration-700 ease-in-out`}
            >
              <div className="hidden md:block w-8 h-8 bg-blue/20 border-4 border-blue rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>

              <div className="w-full md:w-1/2 bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue relative hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-4 bg-blue text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                  {item.period}
                </div>

                <h3 className="text-2xl font-bold text-blue mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>

                <div className="space-y-2 mb-4">
                  {item.milestones.map((milestone, mIndex) => (
                    <div key={mIndex} className="flex items-center">
                      {index % 2 === 0 ? (
                        <FaChevronRight className="mr-2 text-blue" />
                      ) : (
                        <FaChevronLeft className="mr-2 text-blue" />
                      )}
                      <span className="text-gray-700">{milestone}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-blue font-semibold">{item.date}</div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center items-center py-6">
                <div className="relative group overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={item.image}
                    alt={`PESO History ${item.period}`}
                    className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PESOHistory;