import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
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
import AppliedJobs from "./pages/AppliedJobs";

function App() {
    useEffect(() => {
        const auth = getAuth();
        
        // Check on reload if the user was gone for more than 1 minute
        const lastVisit = localStorage.getItem("lastVisit");
        if (lastVisit) {
            const timeElapsed = Date.now() - parseInt(lastVisit, 10);
            if (timeElapsed > 30 * 1000) { // 30 seconds
                signOut(auth).catch((error) => console.error("Sign-out error:", error));
            }
        }

        // Store the timestamp when the user leaves the site
        const handleUnload = () => {
            localStorage.setItem("lastVisit", Date.now().toString());
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signup", "/forgot"];

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <main className="flex-grow">
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
                    <Route path="/applied" element={<AppliedJobs />} />
                </Routes>
            </main>
            {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
        </div>
    );
}

export default App;
