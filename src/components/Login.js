import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import pesoLogo from "../assets/peso-logo.webp"; 

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Check if the email exists in the deleted_logs collection
            const deletedLogsRef = collection(db, "deleted_logs");
            const deletedQuery = query(deletedLogsRef, where("email", "==", email));
            const deletedSnapshot = await getDocs(deletedQuery);
            
            if (!deletedSnapshot.empty) {
                toast.error("This account cannot be used for login.", {
                    duration: 2000,
                });
                setLoading(false);
                return;
            }
            
            // check if the email exists in the profiles collection
            const profilesRef = collection(db, "profiles");
            const emailQuery = query(profilesRef, where("email", "==", email));
            const querySnapshot = await getDocs(emailQuery);
            
            if (querySnapshot.empty) {
                toast.error("Account not found", {
                    duration: 2000,
                });
                setLoading(false);
                return;
            }
            
            // if email is there proceed to checking credentials
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await user.reload();

            if (!user.emailVerified) {
                toast.error("Please verify your email before logging in.", {
                    duration: 2000,
                });
                await auth.signOut();
                setLoading(false);
                return;
            }

            // Update user profile to mark as verified if it's not already
            const userProfileRef = doc(db, "profiles", user.uid);
            const userProfileSnap = await getDoc(userProfileRef);
            
            if (userProfileSnap.exists()) {
                const userData = userProfileSnap.data();
                
                if (!userData.isVerified) {
                    await updateDoc(userProfileRef, {
                        isVerified: true
                    });
                }
            } else {
                // If for some reason the profile doesn't exist (unlikely at this point)
                await setDoc(userProfileRef, {
                    email: email,
                    isVerified: true,
                    createdAt: new Date(),
                    name: null,
                    contactNumber: null,
                    address: null
                });
            }

            toast.success("Signed in successfully!", {
                duration: 1000,
            });

            navigate("/");
        } catch (error) {
            console.error("Error signing in with email and password", error);
            toast.error(`Error signing in: ${error.message}`, {
                duration: 1000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const { uid, displayName, email, photoURL } = user;
            
            // Check if the email exists in the deleted_logs collection
            const deletedLogsRef = collection(db, "deleted_logs");
            const deletedQuery = query(deletedLogsRef, where("email", "==", email));
            const deletedSnapshot = await getDocs(deletedQuery);
            
            if (!deletedSnapshot.empty) {
                toast.error("This account cannot be used for login.", {
                    duration: 3000,
                });
                await auth.signOut(); // Sign out the user
                setLoading(false);
                return;
            }

            const userRef = doc(db, "profiles", uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: displayName || "Unnamed User",
                    email: email,
                    profileImage: photoURL || "",
                    isVerified: true, // Google accounts are pre-verified
                    createdAt: new Date(),
                    contactNumber: null,
                    address: null
                });
            } else {
                // Update the verification status if not already verified
                const userData = userSnap.data();
                if (!userData.isVerified) {
                    await updateDoc(userRef, {
                        isVerified: true
                    });
                }
            }

            toast.success("Signed in successfully with Google!", {
                duration: 3000,
            });

            navigate("/");
        } catch (error) {
            console.error("Error signing in with Google", error);
            toast.error(`Error signing in with Google: ${error.message}`, {
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
            <div className="relative bg-white p-4 sm:p-6 md:p-8 w-full max-w-md border border-neutral-300 rounded-3xl">

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <img src={pesoLogo} alt="PESO Logo" className="h-14 sm:h-16 md:h-20 object-contain" />
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl mt-6 sm:mt-8 font-bold text-black-secondary text-center px-2 sm:px-6 md:px-8">
                    Your Career Starts Here – PESO!
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 text-center mb-4 sm:mb-6 md:mb-8 mt-2">
                    Login to proceed
                </p>

                <form className="space-y-4 sm:space-y-6 w-full max-w-sm mx-auto" onSubmit={handleEmailSignIn}>
                    <div>
                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full mt-2 text-xs sm:text-sm px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-black-secondary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full mt-2 text-xs sm:text-sm px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-black-secondary focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-1 sm:mt-2">
                        <Link to="/forgot" className="text-xs sm:text-sm text-blue hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="mt-2 sm:mt-4">
                        <button
                            type="submit"
                            className="w-full bg-black-secondary text-white px-4 py-2 text-xs sm:text-sm rounded-md hover:bg-black transition flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <ClipLoader size={16} color="white" />}
                            {loading ? " " : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
                    Don't have an account yet?{" "}
                    <Link to="/signup" className="text-darkblue hover:underline">
                        Create an account.
                    </Link>
                </p>

                <div className="relative flex items-center my-3 sm:my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 sm:mx-4 text-xs sm:text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="mt-3 sm:mt-4 text-center">
                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center text-xs sm:text-sm justify-center gap-2 w-full bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200"
                    >
                        <FcGoogle className="text-lg sm:text-2xl" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;