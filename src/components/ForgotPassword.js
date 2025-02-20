import React, { useState } from 'react';
import { auth, sendPasswordResetEmail } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import { FaArrowLeft, FaLock, FaShieldAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Password reset email sent! Please check your inbox.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-gray-600 hover:text-darkblue transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Login
            </button>
          </div>

          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-blue/10 mb-4">
                  <FaLock className="text-3xl text-darkblue" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                <p className="text-gray-600">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent outline-none transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-darkblue text-white px-4 py-3 rounded-lg hover:bg-blue transition-colors flex items-center justify-center gap-2 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color="white" />
                    </>
                  ) : (
                    <>
                      <HiMail className="text-xl" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
                <HiMail className="text-3xl text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
                <br />
                <span className="font-medium text-gray-800">{email}</span>
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Send Another Link
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block w-1/2 bg-slate-700 p-12">
          <div className="h-full flex flex-col items-center justify-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="w-20 h-20 mb-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <FaShieldAlt className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-white">Kalma Batang Kankaloo</h3>
            <p className="text-center text-md text-white/90 max-w-sm">
              Prayoridad namin ang seguridad ng account mo. Sundan mo lang ang instructions sa email para ma-reset ang iyong password.
            </p>
            <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex space-x-3">
              <div className="w-16 h-1 rounded-full bg-white/30" />
              <div className="w-8 h-1 rounded-full bg-white/20" />
              <div className="w-8 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;