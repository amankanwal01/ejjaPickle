import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Shield, Camera } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <div className="container section-padding">Please login to view profile.</div>;

  return (
    <div className="profile-page container section-padding">
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" alt={user.name} />
              <button className="avatar-edit"><Camera size={16} /></button>
            </div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <div className={`role-badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
              {user.role === 'admin' ? 'Luxury Administrator' : 'Premium Member'}
            </div>
          </div>
          
          <div className="profile-nav">
            <button className="active">Personal Info</button>
            <button>Manage Addresses</button>
            <button>Settings</button>
            <button className="danger">Delete Account</button>
          </div>
        </div>

        <div className="profile-main">
          <div className="main-card">
            <div className="card-header">
              <h3>Account Information</h3>
              <button className="btn-secondary btn-sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <label><User size={16} /> Full Name</label>
                <input type="text" defaultValue={user.name} disabled={!isEditing} />
              </div>
              <div className="info-item">
                <label><Mail size={16} /> Email Address</label>
                <input type="email" defaultValue={user.email} disabled={!isEditing} />
              </div>
              <div className="info-item">
                <label><Phone size={16} /> Phone Number</label>
                <input type="text" defaultValue="+91 98765 43210" disabled={!isEditing} />
              </div>
              <div className="info-item">
                <label><MapPin size={16} /> Default City</label>
                <input type="text" defaultValue="Nainital" disabled={!isEditing} />
              </div>
            </div>
          </div>

          <div className="main-card security-card">
            <h3>Security</h3>
            <div className="security-item">
              <div className="security-info">
                <Shield size={24} />
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button className="btn-secondary">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
