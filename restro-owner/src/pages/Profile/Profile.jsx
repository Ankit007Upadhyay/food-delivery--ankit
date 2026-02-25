import React, { useState, useEffect, useContext } from "react";
import "./Profile.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, url } = useContext(StoreContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantAddress: "",
    phone: ""
  });

  const fetchUserData = async () => {
    console.log("=== Fetching Profile Data ===");
    console.log("Token available:", !!token);
    console.log("Token value:", token ? token.substring(0, 20) + "..." : "null");
    console.log("API URL:", url + "/api/user/profile");
    
    if (!token) {
      console.log("❌ No token found - user not logged in");
      toast.error("Please login to view profile");
      return;
    }
    
    try {
      const response = await axios.post(url + "/api/user/profile", {}, {
        headers: { token }
      });
      
      console.log("Profile API Response:", response.data);
      
      if (response.data.success) {
        console.log("✅ Profile data fetched successfully");
        setUserData(response.data.data);
        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          restaurantName: response.data.data.restaurantName || "",
          restaurantAddress: response.data.data.restaurantAddress || "",
          phone: response.data.data.phone || ""
        });
      } else {
        console.log("❌ Profile fetch failed:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error.message);
      toast.error("Error fetching profile data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(url + "/api/user/update-profile", formData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchUserData(); // Refresh data
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h3>Restaurant Profile</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={assets.profile_image} alt="Profile" />
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Owner Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Restaurant Address</label>
                <textarea
                  name="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-section">
                <h4>Owner Information</h4>
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{userData.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{userData.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{userData.phone || "Not provided"}</span>
                </div>
              </div>
              
              <div className="info-section">
                <h4>Restaurant Information</h4>
                <div className="info-item">
                  <span className="label">Restaurant Name:</span>
                  <span className="value">{userData.restaurantName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{userData.restaurantAddress}</span>
                </div>
              </div>
              
              <div className="info-section">
                <h4>Account Status</h4>
                <div className="info-item">
                  <span className="label">Role:</span>
                  <span className="value role-badge">Restaurant Owner</span>
                </div>
                <div className="info-item">
                  <span className="label">Approval Status:</span>
                  <span className={`value status-badge ${userData.isApproved ? 'approved' : 'pending'}`}>
                    {userData.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
