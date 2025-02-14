import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        address: "",
        contactNumber: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trick

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchProfileData(currentUser.uid);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchProfileData = async (uid) => {
        try {
            const profileRef = doc(db, "profiles", uid);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                setProfile(profileSnap.data());
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user) return;
            await setDoc(doc(db, "profiles", user.uid), profile);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            setForceUpdate((prev) => prev + 1); // Force re-render
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    console.log("isEditing state:", isEditing); // Debugging log

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <form key={forceUpdate} onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        disabled={!isEditing}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        disabled={!isEditing}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={profile.contactNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        disabled={!isEditing}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        disabled
                    />
                </div>
                {isEditing ? (
                    <button
                        type="submit"
                        className="w-full bg-green text-white py-2 rounded hover:bg-green"
                    >
                        Save Profile
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full bg-darkblue text-white py-2 rounded hover:bg-blue"
                        onClick={() => {
                            console.log("Edit button clicked!"); // Debugging log
                            setIsEditing(true);
                            setForceUpdate((prev) => prev + 1); // Force re-render
                        }}
                    >
                        Edit Profile
                    </button>
                )}
            </form>
        </div>
    );
};

export default Profile;
