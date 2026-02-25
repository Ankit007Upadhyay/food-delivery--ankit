import React, { useEffect, useState } from "react";
import "./RestroOwners.css";
import axios from "axios";
import { toast } from "react-toastify";

const RestroOwners = ({ url }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedOwners, setApprovedOwners] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(url + "/api/restro-owner/pending");
      if (response.data.success) {
        setPendingRequests(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching pending requests");
    }
  };

  const fetchApprovedOwners = async () => {
    try {
      const response = await axios.get(url + "/api/restro-owner/approved");
      if (response.data.success) {
        setApprovedOwners(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching approved owners");
    }
  };

  const handleApprove = async (ownerId) => {
    try {
      const response = await axios.post(url + "/api/restro-owner/approve", { ownerId });
      if (response.data.success) {
        toast.success("Restaurant owner approved successfully");
        fetchPendingRequests();
        fetchApprovedOwners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error approving owner");
    }
  };

  const handleReject = async (ownerId) => {
    try {
      const response = await axios.post(url + "/api/restro-owner/reject", { ownerId });
      if (response.data.success) {
        toast.success("Restaurant owner request rejected");
        fetchPendingRequests();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error rejecting owner");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchApprovedOwners();
  }, []);

  return (
    <div className="restro-owners">
      <h2>Restaurant Owner Management</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button 
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved Owners ({approvedOwners.length})
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="pending-requests">
          <h3>Pending Approval Requests</h3>
          {pendingRequests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            <div className="owners-list">
              {pendingRequests.map((owner) => (
                <div key={owner._id} className="owner-card">
                  <div className="owner-info">
                    <h4>{owner.name}</h4>
                    <p><strong>Email:</strong> {owner.email}</p>
                    <p><strong>Restaurant:</strong> {owner.restaurantName}</p>
                    <p><strong>Address:</strong> {owner.restaurantAddress}</p>
                    <p><strong>Requested:</strong> {new Date(owner.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="owner-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(owner._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(owner._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "approved" && (
        <div className="approved-owners">
          <h3>Approved Restaurant Owners</h3>
          {approvedOwners.length === 0 ? (
            <p>No approved owners yet</p>
          ) : (
            <div className="owners-list">
              {approvedOwners.map((owner) => (
                <div key={owner._id} className="owner-card">
                  <div className="owner-info">
                    <h4>{owner.name}</h4>
                    <p><strong>Email:</strong> {owner.email}</p>
                    <p><strong>Restaurant:</strong> {owner.restaurantName}</p>
                    <p><strong>Address:</strong> {owner.restaurantAddress}</p>
                    <p><strong>Approved:</strong> {new Date(owner.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="owner-status">
                    <span className="status-badge approved">Approved</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestroOwners;
