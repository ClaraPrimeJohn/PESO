import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { HiMail, HiLockClosed, HiUserAdd } from "react-icons/hi";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.", { position: "top-center", autoClose: 3000 });
            return;
        }
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);

            await setDoc(doc(db, "profiles", user.uid), {
                email: user.email,
                phone: "",
                profileImageUrl: "",
                createdAt: new Date(),
            });

            toast.success("Account created! Verify your email before signing in.", { position: "top-center", autoClose: 3000 });
            navigate("/login");
        } catch (error) {
            toast.error(`Error signing up: ${error.message}`, { position: "top-center", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-md p-8 transform transition-all hover:scale-[1.02]">
                <div className="flex justify-center mb-6">
                    <HiUserAdd className="w-12 h-12 text-blue" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign Up</h2>
                <form className="space-y-6" onSubmit={handleSignup}>
                    <div className="relative">
                        <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent transition" 
                        />
                    </div>
                    <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="password" 
                            placeholder="Password (min. 6 characters)" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent transition" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-blue hover:bg-blue text-white py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader size={24} color="white" />
                        ) : (
                            <>
                                <HiUserAdd className="w-5 h-5 mr-2" />
                                Sign Up
                            </>
                        )}
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue hover:text-blue font-medium hover:underline transition">
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Signup;