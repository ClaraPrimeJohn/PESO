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
        setIsDrawerOpen(false); // Close drawer when initiating logout
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
                    className={`fixed inset-0 bg-darkblue/50 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer - Modernized Design with fixed height and scrollable content */}
                <div
                    className={`absolute top-0 left-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ width: "calc(80vw)", maxWidth: "300px" }}
                >
                    {/* Header - Fixed at top */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center">
                            <img className="w-auto h-7" src={mainLogo} alt="logo" />
                            <div className="ml-2 leading-tight text-xs font-bold text-black-secondary">
                                <h1>Public Employment</h1>
                                <h1>Service Office</h1>
                            </div>
                        </div>
                        <button
                            className="text-xl text-black-secondary hover:text-red transition-colors duration-200 p-1 rounded-full hover:bg-red/5"
                            onClick={() => setIsDrawerOpen(false)}
                            aria-label="Close menu"
                        >
                            <RiCloseLine />
                        </button>
                    </div>

                    {/* Profile Section - More Compact */}
                    <div className="py-4 border-b px-4 bg-gray-50">
                        {user ? (
                            <div className="flex items-center space-x-3 w-full">
                                <div className="relative">
                                    <img
                                        src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <span className="text-xs font-medium text-darkblue block truncate">
                                        {profileData?.name || user.displayName || "Profile"}
                                    </span>
                                    <span className="text-xs text-gray-secondary truncate block">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-xs font-medium w-full text-center py-2 rounded-lg bg-darkblue text-white hover:bg-blue transition-colors duration-300 flex items-center justify-center space-x-2"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <CgProfile className="text-sm" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Actions Section - Only if logged in */}
                    {user && (
                        <div className="px-3 py-3 border-b border-gray-100 flex space-x-2">
                            <Link
                                to="/profile"
                                className="text-xs flex-1 text-center py-2 px-2 rounded-md bg-gray-100 text-darkblue hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <CgProfile className="text-sm" />
                                <span>View Profile</span>
                            </Link>
                            <Link
                                to="/applied"
                                className="text-xs flex-1 text-center py-2 px-2 rounded-md bg-gray-100 text-darkblue hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <FaClipboardList className="text-sm" />
                                <span>Applied Jobs</span>
                            </Link>
                        </div>
                    )}

                    {/* Navigation Links - Scrollable area */}
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 overflow-y-auto py-2">
                            <ul className="space-y-1 px-2">
                                <li>
                                    <Link
                                        to="/"
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm ${location.pathname === "/" ? "bg-yellow/10 text-darkblue font-medium border-l-4 border-yellow" : "text-black-secondary hover:bg-gray-100"}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about-us"
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm ${location.pathname === "/about-us" ? "bg-yellow/10 text-darkblue font-medium border-l-4 border-yellow" : "text-black-secondary hover:bg-gray-100"}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/announcement"
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm ${location.pathname === "/announcement" ? "bg-yellow/10 text-darkblue font-medium border-l-4 border-yellow" : "text-black-secondary hover:bg-gray-100"}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Announcement
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/job-listing"
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm ${location.pathname === "/job-listing" ? "bg-yellow/10 text-darkblue font-medium border-l-4 border-yellow" : "text-black-secondary hover:bg-gray-100"}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Job Listing
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact-us"
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm ${location.pathname === "/contact-us" ? "bg-yellow/10 text-darkblue font-medium border-l-4 border-yellow" : "text-black-secondary hover:bg-gray-100"}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Logout Button - Always visible at bottom */}
                        {user && (
                            <div className="border-t border-gray-100 p-4 sticky bottom-0 bg-white mt-auto">
                                <button
                                    onClick={initiateLogout}
                                    className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-white bg-red/90 hover:bg-red transition-colors duration-200"
                                >
                                    <FaSignOutAlt className="text-sm" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red/10 sm:mx-0 sm:h-10 sm:w-10">
                                        <FaSignOutAlt className="h-6 w-6 text-red" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-darkblue" id="modal-title">
                                            Log out confirmation
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to log out of your account? You will need to log in again to access your profile and applied jobs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red text-base font-medium text-white hover:bg-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={confirmLogout}
                                >
                                    Log out
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkblue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={cancelLogout}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;