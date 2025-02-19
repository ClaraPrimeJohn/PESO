import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Contactus from "./pages/Contactus";
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import Announcement from "./pages/Announcement";
import Joblist from "./pages/Joblist";
import JobDetails from "./pages/JobDetails";
import Login from "./components/Login";
import Profile from "./pages/Profile"; 
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <AppContent isScrolled={isScrolled} />
        </Router>
    );
}

function AppContent({ isScrolled }) {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signup", "/forgot"]; 

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar isScrolled={isScrolled} />}
            <main className={`flex-grow transition-all duration-1000 ${isScrolled ? "pt-16" : "pt-0"}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/announcement" element={<Announcement />} />
                    <Route path="/job-listing" element={<Joblist />} />
                    <Route path="/job/:jobId" element={<JobDetails />} />
                    <Route path="/contact-us" element={<Contactus />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot" element={<ForgotPassword />} /> 
                    <Route path="/profile" element={<Profile />} /> 
                </Routes>
            </main>
            {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
        </div>
    );
}

export default App;
