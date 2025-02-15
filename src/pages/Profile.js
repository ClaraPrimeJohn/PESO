import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CLOUDINARY_UPLOAD_PRESET = "ybbfcbyk";
const CLOUDINARY_CLOUD_NAME = "drg1csmnn";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ name: "", address: "", contactNumber: "", profileImage: "" });
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [originalProfile, setOriginalProfile] = useState(null);

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
                setOriginalProfile(profileSnap.data());
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
            console.log("Updating profile in Firestore:", profile);
            await setDoc(doc(db, "profiles", user.uid), profile, { merge: true });
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "profiles");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!data.secure_url) throw new Error("Image upload failed.");
            setProfile((prevProfile) => ({ ...prevProfile, profileImage: data.secure_url }));
            toast.success("Profile image uploaded successfully!");
            await setDoc(doc(db, "profiles", user.uid), { profileImage: data.secure_url }, { merge: true });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
        setPreviewImage(null);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 relative border">
            <div className="mb-4 text-center">
                    {(previewImage || profile.profileImage) && (
                        <img src={previewImage || profile.profileImage} alt="Profile" className="w-24 h-24 mt-2 rounded-full border mx-auto" />
                    )}
                    <label className="block text-sm font-semibold mb-8">Profile Image</label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full p-2 border rounded"/>
                </div>
            <h2 className="text-xl font-bold mt-8 text-center">Profile</h2>
            {isEditing && <p className="text-sm text-green font-bold">Editing Mode...</p>}
            <form onSubmit={handleSubmit} className={isEditing ? "border border-green p-4 rounded" : ""}>
                <div className="mb-4"> 
                    
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} className={`w-full p-2 border rounded ${isEditing ? "border-green" : ""}`} disabled={!isEditing} required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Address</label>
                    <input type="text" name="address" value={profile.address} onChange={handleChange} className={`w-full p-2 border rounded ${isEditing ? "border-green" : ""}`} disabled={!isEditing} required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Contact Number</label>
                    <input type="text" name="contactNumber" value={profile.contactNumber} onChange={handleChange} className={`w-full p-2 border rounded ${isEditing ? "border-green" : ""}`} disabled={!isEditing} required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input type="email" value={user?.email || ""} className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" disabled />
                </div>
                {isEditing ? (
                    <div className="flex space-x-4">
                        <button type="submit" className="flex-1 bg-darkblue text-white py-2 rounded hover:bg-green">Save</button>
                        <button type="button" className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600" onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button type="button" className="w-full bg-blue text-white py-2 rounded hover:bg-blue-600" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </form>
        </div>
    );
};

export default Profile;
