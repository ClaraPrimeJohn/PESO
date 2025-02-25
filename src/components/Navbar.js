import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import mainLogo from "../assets/mainLogo.png";
import { CgProfile } from "react-icons/cg";
import { RiMenu3Line, RiCloseLine, RiArrowDropDownLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [profileData, setProfileData] = useState(null);  
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            let currentScroll = window.scrollY || document.documentElement.scrollTop;

            if (currentScroll > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll); 
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
    }, [lastScrollTop]);

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
            ? "border-b-2 border-darkblue text-darkblue"
            : "text-black hover:text-darkblue";

    return (
        <div>
            <header
                className={`bg-white shadow-md px-6 py-2 flex items-center justify-between w-full z-50 transition-all duration-300 
                    ${isScrolled
                        ? "fixed top-0 shadow-md bg-white/80 backdrop-blur-md py-2 text-gray-900 smooth-transition"
                        : " py-3 bg-transparent"
                    }`}
            >
                <img className="w-auto h-12 p-1" src={mainLogo} alt="logo" />
                
                {/* Hamburger Menu Button for mobile */}
                <button
                    className="lg:hidden text-2xl text-black"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <RiMenu3Line />
                </button>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex justify-center items-center text-sm w-full space-x-6">
                    <Link to="/" className={`${getActiveClass("/")} nav-effects`}>
                        Home
                    </Link>
                    <Link to="/about-us" className={`${getActiveClass("/about-us")} nav-effects`}>
                        About us
                    </Link>
                    <Link to="/announcement" className={`${getActiveClass("/announcement")} nav-effects`}>
                        Announcement
                    </Link>
                    <Link to="/job-listing" className={`${getActiveClass("/job-listing")} nav-effects`}>
                        Job listing
                    </Link>
                    <Link to="/contact-us" className={`${getActiveClass("/contact-us")} nav-effects`}>
                        Contact us
                    </Link>
                    
                </nav>

                {/* Login/Profile Dropdown */}
                <div className="relative hidden lg:block">
                    {user ? (
                        <button className="flex items-center text-black hover:text-darkblue min-w-max" onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}>
                            <img
                                src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-sm pl-2 overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                {profileData?.name || user.displayName || "Profile"}
                            </span>
                            <RiArrowDropDownLine className={`text-4xl transform transition-transform duration-300 ${isLoginDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center text-sm text-black hover:text-darkblue"
                        >
                            <CgProfile className="text-xl mx-2" /> Login
                        </Link>
                    )}
                    {isLoginDropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                            <ul className="py-2">
                                <li className="px-4 py-2 cursor-pointer nav-effects">
                                    <Link
                                        to="/profile"
                                        className="flex items-center text-sm space-x-2 w-full"
                                    >
                                        <CgProfile className="text-xl" />
                                        <span>Profile</span>
                                    </Link>
                                </li>
                                <li className="px-4 py-2 cursor-pointer nav-effects">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-sm space-x-2 w-full"
                                    >
                                        <FaUserEdit className="text-xl" />
                                        <span>Log out</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Drawer and Overlay */}
            <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isDrawerOpen ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setIsDrawerOpen(false)}
                ></div>

                {/* Drawer */}
                <div
                    className={`absolute top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col 
                    ${isDrawerOpen ? "translate-x-0 delay-500" : "-translate-x-full"}`}
                    style={{ width: "calc(80vw)", maxWidth: "400px" }}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="text-lg font-bold">Menu</h2>
                        <button className="text-2xl" onClick={() => setIsDrawerOpen(false)}>
                            <RiCloseLine />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-4 border-b px-6">
                        {user ? (
                            <div className="flex flex-col items-center w-full">
                                <img
                                    src={profileData?.profileImage || user.photoURL || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-sm pl-2 overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                                    {profileData?.name || user.displayName || "Profile"}
                                </span>
                                <Link
                                    to="/profile"
                                    className="text-sm text-black w-full hover:text-darkblue text-center mx-2 mt-2 py-2 border rounded-md bg-gray-100"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Profile
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-black hover:text-darkblue py-2 border rounded-md bg-gray-100"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col p-5 mx-2 text-sm space-y-8 text-center">
                        <Link to="/" className={`${getActiveClass("/")} nav-effects`} onClick={() => setIsDrawerOpen(false)}>
                            Home
                        </Link>
                        <Link to="/about-us" className={`${getActiveClass("/about-us")} nav-effects`} onClick={() => setIsDrawerOpen(false)}>
                            About us
                        </Link>
                        <Link to="/announcement" className={`${getActiveClass("/announcement")} nav-effects`} onClick={() => setIsDrawerOpen(false)}>
                            Announcement
                        </Link>
                        <Link to="/job-listing" className={`${getActiveClass("/job-listing")} nav-effects`} onClick={() => setIsDrawerOpen(false)}>
                            Job listing
                        </Link>
                        <Link to="/contact-us" className={`${getActiveClass("/contact-us")} nav-effects`} onClick={() => setIsDrawerOpen(false)}>
                            Contact us
                        </Link>
                        
                    </nav>

                    {/* Logout Section */}
                    <div className="p-6 mt-auto">
                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsDrawerOpen(false);
                                }}
                                className="text-red hover:font-bold w-full text-sm bg-gray-100 border border-red rounded-md p-3"
                            >
                                Log out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;