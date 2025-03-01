import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mainLogo from "../assets/peso-logo.webp";
import { CgProfile } from "react-icons/cg";
import { RiMenu3Line, RiCloseLine, RiArrowDropDownLine } from "react-icons/ri";
import { FaUserEdit, FaClipboardList } from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
        };

        window.addEventListener("scroll", handleScroll);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchProfileData(currentUser.uid);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!", {
                position: "top-center",
                autoClose: 1000,
            });
            navigate("/");
        } catch (error) {
            console.error("Error during sign out:", error);
            toast.error("Error logging out. Please try again.", {
                position: "top-center",
                autoClose: 1000,
            });
        }
    };

    const fetchProfileData = async (uid) => {
        try {
            const db = getFirestore();
            const profileRef = doc(db, "profiles", uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                setProfileData(profileSnap.data());
            } else {
                console.log("No profile found");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const getActiveClass = (path) =>
        location.pathname === path
            ? "text-darkblue relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-darkblue"
            : "text-gray-700 hover:text-darkblue transition-colors duration-300";

    const navbarHeight = scrollPosition > 50 ? "h-16" : "h-20";
    const navbarPadding = scrollPosition > 50 ? "py-2" : "py-3";
    const navbarBackground = scrollPosition > 50 ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white";
    const logoSize = scrollPosition > 50 ? "h-12" : "h-14";

    return (
        <div>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border border-b-neutral-300 ${navbarBackground} ${navbarPadding} ${navbarHeight}`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            className={`w-auto ${logoSize} transition-all duration-300`}
                            src={mainLogo}
                            alt="logo"
                        />
                        <div className="ml-2 leading-tight font-bold text-black-secondary">
                            <h1>Public Employment</h1>
                            <h1>Service Office</h1>
                        </div>
                    </div>



                    {/* Hamburger Menu Button for mobile */}
                    <button
                        className="lg:hidden text-2xl text-gray-700 hover:text-darkblue transition-colors duration-300"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <RiMenu3Line />
                    </button>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex justify-center items-center text-sm space-x-8">
                        <Link to="/" className={`${getActiveClass("/")} font-medium py-2`}>
                            Home
                        </Link>
                        <Link to="/about-us" className={`${getActiveClass("/about-us")} font-medium py-2`}>
                            About us
                        </Link>
                        <Link to="/announcement" className={`${getActiveClass("/announcement")} font-medium py-2`}>
                            Announcement
                        </Link>
                        <Link to="/job-listing" className={`${getActiveClass("/job-listing")} font-medium py-2`}>
                            Job listing
                        </Link>
                        <Link to="/contact-us" className={`${getActiveClass("/contact-us")} font-medium py-2`}>
                            Contact us
                        </Link>
                    </nav>

                    {/* Login/Profile Dropdown */}
                    <div className="relative hidden lg:block">
                        {user ? (
                            <button
                                className="flex items-center text-gray-700 hover:text-darkblue min-w-max bg-gray-100 rounded-full py-1 px-2 transition-all duration-300 hover:bg-gray-200"
                                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                            >
                                <img
                                    src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                />
                                <span className="text-sm pl-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-32">
                                    {profileData?.name || user.displayName || "Profile"}
                                </span>
                                <RiArrowDropDownLine className={`text-3xl transform transition-transform duration-300 ${isLoginDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-darkblue bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-all duration-300"
                            >
                                <CgProfile className="text-xl mr-2" /> Login
                            </Link>
                        )}
                        {isLoginDropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border animate-fadeIn">
                            <ul className="py-2">
                                <li className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                    <Link
                                        to="/profile"
                                        className="flex items-center text-sm space-x-2 w-full text-gray-700"
                                    >
                                        <CgProfile className="text-xl" />
                                        <span>Profile</span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                    <Link
                                        to="/applied"
                                        className="flex items-center text-sm space-x-2 w-full text-gray-700"
                                    >
                                        <FaClipboardList className="text-xl" />
                                        <span>Applied Jobs</span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-sm space-x-2 w-full text-gray-700"
                                    >
                                        <FaUserEdit className="text-xl" />
                                        <span>Log out</span>
                                    </button>
                                </li>
                            </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Add a spacer div that adjusts to navbar height */}
            <div className={`transition-all duration-300 ${scrollPosition > 50 ? "h-16" : "h-20"}`}></div>

            {/* Drawer and Overlay */}
            <div className={`fixed inset-0 z-50 transition-all duration-500 ${isDrawerOpen ? "visible" : "invisible"}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDrawerOpen ? "opacity-50" : "opacity-0"}`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer */}
                <div
                    className={`absolute top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    style={{ width: "calc(80vw)", maxWidth: "320px" }}
                >
                    <div className="flex items-center justify-between p-5 border-b">
                        <img className="w-auto h-8" src={mainLogo} alt="logo" />
                        <button
                            className="text-2xl text-gray-700 hover:text-darkblue transition-colors duration-200"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <RiCloseLine />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-6 border-b px-6">
                        {user ? (
                            <div className="flex flex-col items-center w-full">
                                <div className="relative">
                                    <img
                                        src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                                    />
                                </div>
                                <span className="text-sm font-medium mt-2 text-gray-800">
                                    {profileData?.name || user.displayName || "Profile"}
                                </span>
                                <Link
                                    to="/profile"
                                    className="text-sm w-full text-center mt-4 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    View Profile
                                </Link>
                                <Link
                                    to="/applied"
                                    className="text-sm w-full text-center mt-2 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Applied Jobs
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium w-full text-center py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <CgProfile className="inline-block mr-2" /> Login
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col p-5 space-y-5">
                        <Link
                            to="/"
                            className={`${location.pathname === "/" ? "text-darkblue font-medium" : "text-gray-700"} transition-colors duration-200 hover:text-darkblue py-2`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about-us"
                            className={`${location.pathname === "/about-us" ? "text-darkblue font-medium" : "text-gray-700"} transition-colors duration-200 hover:text-darkblue py-2`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            About us
                        </Link>
                        <Link
                            to="/announcement"
                            className={`${location.pathname === "/announcement" ? "text-darkblue font-medium" : "text-gray-700"} transition-colors duration-200 hover:text-darkblue py-2`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Announcement
                        </Link>
                        <Link
                            to="/job-listing"
                            className={`${location.pathname === "/job-listing" ? "text-darkblue font-medium" : "text-gray-700"} transition-colors duration-200 hover:text-darkblue py-2`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Job listing
                        </Link>
                        <Link
                            to="/contact-us"
                            className={`${location.pathname === "/contact-us" ? "text-darkblue font-medium" : "text-gray-700"} transition-colors duration-200 hover:text-darkblue py-2`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Contact us
                        </Link>
                    </nav>

                    {/* Logout Section */}
                    {user && (
                        <div className="p-6 mt-auto border-t">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsDrawerOpen(false);
                                }}
                                className="w-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-red-600 rounded-full p-3 transition-colors duration-300 flex items-center justify-center"
                            >
                                <FaUserEdit className="mr-2" /> Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;