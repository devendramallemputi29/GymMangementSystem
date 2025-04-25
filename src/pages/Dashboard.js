import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceipts, setShowReceipts] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, "members"));
        const members = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const matched = members.find((m) => m.email === user.email);
        if (matched) {
          setUserData(matched);
          
          // Fetch receipts if user is found
          const receiptsSnapshot = await getDocs(collection(db, "bills", matched.id, "receipts"));
          const receiptsData = receiptsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReceipts(receiptsData);
        } else {
          console.log("User data not found in 'members' collection");
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const toggleReceipts = () => {
    setShowReceipts(!showReceipts);
    if (showNotification) setShowNotification(false);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
    if (showReceipts) setShowReceipts(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome, {userData?.name || "User"}!</h2>
        
        <div className="user-info">
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>Membership Plan:</strong> {userData?.membership}</p>
          <p><strong>Fee Package:</strong> {userData?.feePackage || "Not Assigned"}</p>
        </div>

        <div className="notification-badge">
          <p><strong>Notification:</strong> {userData?.notification ? "1 New" : "None yet"}</p>
          {userData?.notification && (
            <span className="badge">1</span>
          )}
        </div>
        
        <div className="action-buttons">
          <button className="feature-btn" onClick={toggleReceipts}>
            {showReceipts ? "Hide Receipts" : "View Bill Receipts"}
          </button>
          <button className="feature-btn" onClick={toggleNotification}>
            {showNotification ? "Hide Notification" : "View Bill Notification"}
          </button>
        </div>

        {showReceipts && (
          <div className="receipts-section">
            <h3>Your Bill Receipts</h3>
            {receipts.length > 0 ? (
              <div className="receipts-list">
                {receipts.map((receipt) => (
                  <div key={receipt.id} className="receipt-item">
                    <div className="receipt-header">
                      <span className="receipt-date">{formatDate(receipt.date)}</span>
                      <span className="receipt-amount">${receipt.amount.toFixed(2)}</span>
                    </div>
                    <div className="receipt-details">
                      <p><strong>Bill ID:</strong> {receipt.billId}</p>
                      <p><strong>Status:</strong> <span className={`status-${receipt.status.toLowerCase()}`}>{receipt.status}</span></p>
                      {receipt.dueDate && (
                        <p><strong>Due Date:</strong> {formatDate(receipt.dueDate)}</p>
                      )}
                    </div>
                    <button className="view-details-btn">View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No bill receipts found</p>
            )}
          </div>
        )}

        {showNotification && (
          <div className="notification-section">
            <h3>Bill Notification</h3>
            {userData?.notification ? (
              <div className="notification-message">
                <div className="notification-header">
                  <span className="notification-title">Payment Due</span>
                  <span className="notification-date">{formatDate(userData.notificationDate)}</span>
                </div>
                <p>{userData.notification}</p>
                <div className="notification-actions">
                  <button className="pay-now-btn">Pay Now</button>
                  <button className="dismiss-btn">Dismiss</button>
                </div>
              </div>
            ) : (
              <p className="no-data">No notifications at this time</p>
            )}
          </div>
        )}

        {userData?.email?.endsWith("@admin.com") ? (
          <div className="admin-section">
            <p className="access-text">You have <strong>Admin Access</strong></p>
            <Link to="/admin">
              <button className="dashboard-btn">Go to Admin Panel</button>
            </Link>
          </div>
        ) : (
          <p className="access-text">You are a <strong>Member</strong></p>
        )}

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
