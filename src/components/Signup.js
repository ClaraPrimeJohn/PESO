import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form className="space-y-4" onSubmit={handleSignup}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="w-full px-4 py-2 border rounded-md" />
                    <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="w-full px-4 py-2 border rounded-md" />
                    
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-darkblue transition flex items-center justify-center gap-2 disabled:opacity-50" disabled={loading}>
                        {loading && <ClipLoader size={20} color="white" />} {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    Already have an account? <a href="/login" className="text-darkblue hover:underline">Sign in here.</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
