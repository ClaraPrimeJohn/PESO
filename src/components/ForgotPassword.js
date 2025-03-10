import React, { useState } from 'react';
import { auth, sendPasswordResetEmail } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from "react-hot-toast";
import { Link } from 'react-router-dom';
import pesoLogo from "../assets/peso-logo.webp";
import { db } from '../firebase'; // Import Firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore query methods

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if email exists in profiles collection
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Email not found in profiles collection
        toast.error('No account found with this email address.', {
          duration: 3000,
        });
        setLoading(false);
        return;
      }
      
      // Email exists, proceed with password reset
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Password reset email sent! Please check your inbox.', {
        duration: 2000,
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error(`Error: ${error.message}`, {
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
          Forgot Your Password?
        </h1>
        
        {!emailSent ? (
          <>
            <p className="text-sm sm:text-base text-neutral-600 text-center mb-4 sm:mb-6 md:mb-8 mt-2">
              Enter your email to receive a reset link
            </p>

            <form className="space-y-4 sm:space-y-6 w-full max-w-sm mx-auto" onSubmit={handleResetPassword}>
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

              <div className="mt-2 sm:mt-4">
                <button
                  type="submit"
                  className="w-full bg-black-secondary text-white px-4 py-2 text-xs sm:text-sm rounded-md hover:bg-black transition flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && <ClipLoader size={16} color="white" />}
                  {loading ? " " : "Send Reset Link"}
                </button>
              </div>
            </form>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-darkblue hover:underline">
                Back to login
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm sm:text-base text-neutral-600 text-center mb-4 sm:mb-6 mt-2">
              Check your email inbox
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-medium text-black-secondary">{email}</p>
            </div>
            
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full bg-black-secondary text-white px-4 py-2 text-xs sm:text-sm rounded-md hover:bg-black transition"
            >
              Send Another Link
            </button>
            
            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
              <Link to="/login" className="text-darkblue hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;