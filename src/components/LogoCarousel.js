import React from "react";
import Logo from "../assets/svgexport-173.webp";
import Logo1 from "../assets/svgexport-293.webp";
import Logo2 from "../assets/svgexport-218.webp";
import Logo3 from "../assets/svgexport-257.webp";
import Logo4 from "../assets/svgexport-233.webp";
import Logo5 from "../assets/svgexport-299.webp";

function LogoCarousel() {
  const logos = [
    { name: "Amazon", src: Logo },
    { name: "AMD", src: Logo1 },
    { name: "Cisco", src: Logo2 },
    { name: "Dropcam", src: Logo3 },
    { name: "Logitech", src: Logo4 },
    { name: "Spotify", src: Logo5 },
  ];

  return (
    <div className="bg-white px-4 md:px-16 py-28">
      <h2 className="text-center text-gray-600 text-lg mb-10">
        Trusted by various companies around the Philippines
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-16">
        {logos.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            className="h-12 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}

export default LogoCarousel;
