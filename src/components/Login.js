import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
    auth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Sign in with email and password
    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Signed in successfully!", {
                position: "top-center",
                autoClose: 1000,
            });
            navigate("/");
        } catch (error) {
            console.error("Error signing in with email and password", error);
            toast.error(`Error signing in: ${error.message}`, {
                position: "top-center",
                autoClose: 1000,
            });
        } finally {
            setLoading(false); 
        }
    };


    // Sign in with Google
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in with Google:", result.user);
            toast.success("Signed in successfully with Google!", {
                position: "top-center",
                autoClose: 3000,
            });
            navigate("/");
        } catch (error) {
            console.error("Error signing in with Google", error);
            toast.error(`Error signing in with Google: ${error.message}`, {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-5xl">
                <div className="flex flex-col sm:flex-row">
                    {/* Left Side: Login Form */}
                    <div className="w-full sm:w-1/2 lg:p-12 p-8 bg-gray-50">
                        <h2 className="text-2xl font-bold mb-10 text-center">
                            WELCOME | <span className="text-darkblue">PESO</span>
                        </h2>
                        <form className="space-y-4" onSubmit={handleEmailSignIn}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full mt-2 mb-2 px-4 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-darkblue focus:outline-none"
                                />
                            </div>
                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full mt-2 mb-2 px-4 py-2 border border-gray-300   rounded-md focus:ring-2 focus:ring-darkblue focus:outline-none"
                                />
                            </div>
                            {/* Sign In Button */}
                            <div className="flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="bg-blue text-white px-4 py-2 rounded-md hover:bg-darkblue transition flex items-center justify-center gap-2"
                                    disabled={loading} >
                                    {loading && <ClipLoader size={20} color="white" />} 
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                                <a href="/basta" className="text-sm text-blue hover:underline">
                                    Forgot Password?
                                </a>
                            </div>
                        </form>
                        {/* Sign Up Link */}
                        <p className="mt-6 text-center text-sm">
                            Don’t have an account yet?{" "}
                            <a href="/signup" className="text-darkblue hover:underline">
                                Create an account.
                            </a>
                        </p>
                        {/* OR Divider */}
                        <div className="relative flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-sm text-gray-500">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        {/* Google Sign In */}
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleGoogleSignIn}
                                className="flex items-center justify-center gap-2 w-full bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                            >
                                <FcGoogle className="text-2xl" />
                                Sign in with Google
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className="w-full sm:w-1/2">
                        <img
                            src={require("../assets/login-main.jpg")}
                            alt="Login Visual"
                            className="object-cover h-full w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
