import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mainLogo from "../assets/peso-logo.webp";
import { CgProfile } from "react-icons/cg";
import { RiMenu3Line, RiCloseLine, RiArrowDropDownLine } from "react-icons/ri";
import { FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
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

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (isLoginDropdownOpen && !event.target.closest(".profile-dropdown")) {
                setIsLoginDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
            unsubscribe();
        };
    }, [isLoginDropdownOpen]);

    const initiateLogout = () => {
        setIsLogoutConfirmOpen(true);
        setIsLoginDropdownOpen(false);
    };

    const confirmLogout = async () => {
        try {
            await signOut(auth);
            setIsLogoutConfirmOpen(false);
            toast.success("Logged out successfully!", {
                duration: 1000,
            });
            navigate("/");
        } catch (error) {
            console.error("Error during sign out:", error);
            toast.error("Error logging out. Please try again.", {
                position: "top-center",
                duration: 1000,
            });
        }
    };

    const cancelLogout = () => {
        setIsLogoutConfirmOpen(false);
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
            ? "text-darkblue font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow"
            : "text-black-secondary hover:text-darkblue transition-colors duration-300";

    const navbarHeight = scrollPosition > 50 ? "h-16" : "h-20";
    const navbarPadding = scrollPosition > 50 ? "py-2" : "py-3";
    const navbarBackground = scrollPosition > 50 ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white";
    const logoSize = scrollPosition > 50 ? "h-12" : "h-14";

    return (
        <div>
            <header
                className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b border-b-gray-200 ${navbarBackground} ${navbarPadding} ${navbarHeight}`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center group transition-all duration-300">
                        <img
                            className={`w-auto ${logoSize} transition-all duration-300 group-hover:scale-105`}
                            src={mainLogo}
                            alt="PESO logo"
                        />
                        <div className="ml-2 leading-tight font-bold text-black-secondary">
                            <h1>Public Employment</h1>
                            <h1>Service Office</h1>
                        </div>
                    </Link>

                    {/* Hamburger Menu Button for mobile */}
                    <button
                        className="lg:hidden text-2xl text-darkblue hover:text-blue transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow rounded-md p-1"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <RiMenu3Line />
                    </button>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex justify-center items-center text-sm space-x-10">
                        <Link to="/" className={`${getActiveClass("/")} font-medium py-2`}>
                            Home
                        </Link>
                        <Link to="/about-us" className={`${getActiveClass("/about-us")} font-medium py-2`}>
                            About Us
                        </Link>
                        <Link to="/announcement" className={`${getActiveClass("/announcement")} font-medium py-2`}>
                            Announcement
                        </Link>
                        <Link to="/job-listing" className={`${getActiveClass("/job-listing")} font-medium py-2`}>
                            Job Listing
                        </Link>
                        <Link to="/contact-us" className={`${getActiveClass("/contact-us")} font-medium py-2`}>
                            Contact Us
                        </Link>
                    </nav>

                    {/* Login/Profile Dropdown */}
                    <div className="relative hidden lg:block profile-dropdown">
                        {user ? (
                            <button
                                className="flex items-center text-darkblue min-w-max bg-gray-100 hover:bg-yellow/10 rounded-full py-1.5 px-3 transition-all duration-300 border border-transparent hover:border-yellow/30 focus:outline-none focus:ring-2 focus:ring-yellow/40"
                                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                                aria-expanded={isLoginDropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="relative">
                                    <img
                                        src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green rounded-full border-2 border-white"></div>
                                </div>
                                <span className="text-sm font-medium pl-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-32">
                                    {profileData?.name || user.displayName || "Profile"}
                                </span>
                                <RiArrowDropDownLine 
                                    className={`text-3xl transform transition-transform duration-300 ${isLoginDropdownOpen ? "rotate-180" : ""}`} 
                                />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center text-sm font-medium text-darkblue bg-yellow/10 hover:bg-yellow/20 rounded-full px-5 py-2.5 transition-all duration-300 border border-yellow/30"
                            >
                                <CgProfile className="text-xl mr-2" /> Login
                            </Link>
                        )}
                        {isLoginDropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 animate-fadeIn overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                                <p className="text-sm font-semibold text-darkblue truncate">{user.email}</p>
                            </div>
                            <ul className="py-2">
                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2.5 text-sm space-x-3 w-full text-black-secondary hover:text-darkblue hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => setIsLoginDropdownOpen(false)}
                                    >
                                        <CgProfile className="text-lg text-blue" />
                                        <span>View Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/applied"
                                        className="flex items-center px-4 py-2.5 text-sm space-x-3 w-full text-black-secondary hover:text-darkblue hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => setIsLoginDropdownOpen(false)}
                                    >
                                        <FaClipboardList className="text-lg text-blue" />
                                        <span>Applied Jobs</span>
                                    </Link>
                                </li>
                                <li className="border-t border-gray-100 mt-1">
                                    <button
                                        onClick={initiateLogout}
                                        className="flex items-center px-4 py-2.5 text-sm space-x-3 w-full text-red hover:bg-red/5 transition-colors duration-200"
                                    >
                                        <FaSignOutAlt className="text-lg" />
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
                    className={`fixed inset-0 bg-darkblue/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer */}
                <div
                    className={`absolute top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
                        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    style={{ width: "calc(80vw)", maxWidth: "320px" }}
                >
                    <div className="flex items-center justify-between p-5 border-b">
                        <div className="flex items-center">
                            <img className="w-auto h-8" src={mainLogo} alt="logo" />
                            <div className="ml-2 leading-tight text-sm font-bold text-black-secondary">
                                <h1>Public Employment</h1>
                                <h1>Service Office</h1>
                            </div>
                        </div>
                        <button
                            className="text-2xl text-black-secondary hover:text-red transition-colors duration-200 p-1 rounded-full hover:bg-red/10"
                            onClick={() => setIsDrawerOpen(false)}
                            aria-label="Close menu"
                        >
                            <RiCloseLine />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-6 border-b px-6 bg-gray-50">
                        {user ? (
                            <div className="flex flex-col items-center w-full">
                                <div className="relative">
                                    <img
                                        src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green rounded-full border-2 border-white"></div>
                                </div>
                                <span className="text-sm font-medium mt-2 text-darkblue">
                                    {profileData?.name || user.displayName || "Profile"}
                                </span>
                                <span className="text-xs text-gray-secondary mb-4 truncate max-w-full">
                                    {user.email}
                                </span>
                                <Link
                                    to="/profile"
                                    className="text-sm w-full text-center mt-1 py-2 px-4 rounded-lg bg-blue text-white hover:bg-darkblue transition-colors duration-300 flex items-center justify-center space-x-2"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    <CgProfile />
                                    <span>View Profile</span>
                                </Link>
                                <Link
                                    to="/applied"
                                    className="text-sm w-full text-center mt-2 py-2 px-4 rounded-lg bg-green/20 text-black-secondary hover:bg-green/30 transition-colors duration-300 flex items-center justify-center space-x-2"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    <FaClipboardList />
                                    <span>Applied Jobs</span>
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium w-full text-center py-3 rounded-lg bg-yellow text-darkblue hover:bg-yellow/80 transition-colors duration-300 flex items-center justify-center space-x-2"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <CgProfile className="text-lg" /> 
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col p-5 space-y-1">
                        <Link
                            to="/"
                            className={`flex items-center space-x-3 ${
                                location.pathname === "/" 
                                ? "text-darkblue font-medium bg-blue/10 rounded-lg" 
                                : "text-black-secondary"
                            } transition-colors duration-200 hover:text-darkblue hover:bg-blue/5 py-3 px-4 rounded-lg`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className={location.pathname === "/" ? "text-yellow font-bold" : ""}>Home</span>
                        </Link>
                        <Link
                            to="/about-us"
                            className={`flex items-center space-x-3 ${
                                location.pathname === "/about-us" 
                                ? "text-darkblue font-medium bg-blue/10 rounded-lg" 
                                : "text-black-secondary"
                            } transition-colors duration-200 hover:text-darkblue hover:bg-blue/5 py-3 px-4 rounded-lg`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className={location.pathname === "/about-us" ? "text-yellow font-bold" : ""}>About Us</span>
                        </Link>
                        <Link
                            to="/announcement"
                            className={`flex items-center space-x-3 ${
                                location.pathname === "/announcement" 
                                ? "text-darkblue font-medium bg-blue/10 rounded-lg" 
                                : "text-black-secondary"
                            } transition-colors duration-200 hover:text-darkblue hover:bg-blue/5 py-3 px-4 rounded-lg`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className={location.pathname === "/announcement" ? "text-yellow font-bold" : ""}>Announcement</span>
                        </Link>
                        <Link
                            to="/job-listing"
                            className={`flex items-center space-x-3 ${
                                location.pathname === "/job-listing" 
                                ? "text-darkblue font-medium bg-blue/10 rounded-lg" 
                                : "text-black-secondary"
                            } transition-colors duration-200 hover:text-darkblue hover:bg-blue/5 py-3 px-4 rounded-lg`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className={location.pathname === "/job-listing" ? "text-yellow font-bold" : ""}>Job Listing</span>
                        </Link>
                        <Link
                            to="/contact-us"
                            className={`flex items-center space-x-3 ${
                                location.pathname === "/contact-us" 
                                ? "text-darkblue font-medium bg-blue/10 rounded-lg" 
                                : "text-black-secondary"
                            } transition-colors duration-200 hover:text-darkblue hover:bg-blue/5 py-3 px-4 rounded-lg`}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <span className={location.pathname === "/contact-us" ? "text-yellow font-bold" : ""}>Contact Us</span>
                        </Link>
                    </nav>

                    {/* Logout Section */}
                    {user && (
                        <div className="p-5 mt-auto border-t">
                            <button
                                onClick={() => {
                                    initiateLogout();
                                    setIsDrawerOpen(false);
                                }}
                                className="w-full text-sm font-medium bg-red/10 hover:bg-red/20 text-red rounded-lg p-3 transition-colors duration-300 flex items-center justify-center space-x-2"
                            >
                                <FaSignOutAlt />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-200 scale-100 animate-fadeIn">
                        <h3 className="text-xl font-semibold text-darkblue mb-6 text-center tracking-tight">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-secondary text-center mb-8 text-sm">
                            Are you sure you want to end your session?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                className="flex-1 bg-red text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red/90 focus:ring-4 focus:ring-red/20 focus:outline-none transition-colors duration-150 text-sm"
                                onClick={confirmLogout}
                            >
                                Log Out
                            </button>
                            <button
                                className="flex-1 bg-gray-200 text-black-secondary px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 focus:outline-none transition-colors duration-150 text-sm"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;