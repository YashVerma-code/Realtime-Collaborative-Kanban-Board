import React, { useEffect, useState } from "react";
import { Camera, User, Mail, Clock, Calendar, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import "./profile.css";

export default function Profile() {
  const { isUpdatingProfile, authUser, setIsUpdatingProfile, UploadProfile } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedImg(authUser?.profilePic);
  }, [authUser]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setSelectedImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await UploadProfile({ profilePic: selectedImg });
    } catch (error) {
      console.log("Error occurred", error);
    } finally {
      setIsSaving(false);
    }
    setIsUpdatingProfile(false);
  };

  const handleCancel = () => {
    setSelectedImg(null);
    setIsUpdatingProfile(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-card">
          <div className="profile-cover" />

          <div className="profile-content">
            <div className="profile-info-top">
              <div className="profile-pic-wrapper">
                {selectedImg || authUser?.profilePic ? (
                  <img
                    src={selectedImg || authUser?.profilePic}
                    alt="Profile"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <User className="icon" />
                  </div>
                )}

                {isUpdatingProfile && (
                  <label className="profile-pic-upload">
                    <Camera className="icon" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="profile-buttons">
                {!isUpdatingProfile ? (
                  <button
                    className="edit-btn"
                    onClick={() => setIsUpdatingProfile(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      className="cancel-btn"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-btn"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="loading-spinner" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="profile-grid">
              <div>
                <label className="profile-label">
                  <User className="icon-sm" /> Full Name
                </label>
                <div className="profile-field">
                  {authUser?.fullName.toUpperCase()}
                </div>
              </div>

              <div>
                <label className="profile-label">
                  <Mail className="icon-sm" /> Email Address
                </label>
                <div className="profile-field">{authUser?.email}</div>
              </div>

              <div>
                <label className="profile-label">
                  <Clock className="icon-sm" /> Status
                </label>
                <div className="profile-field">
                  <CheckCircle className="icon-sm green" />
                  <span>Active</span>
                </div>
              </div>

              <div>
                <label className="profile-label">
                  <Calendar className="icon-sm" /> Member Since
                </label>
                <div className="profile-field">{formatDate(authUser?.createdAt)}</div>
              </div>
            </div>

            <div className="profile-bottom">
              <h3>Account Information</h3>
              <p>
                Your account has been active for{" "}
                {Math.floor(
                  (new Date() - new Date(authUser?.createdAt)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
