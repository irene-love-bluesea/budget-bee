import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const { userId } = useParams();
  const getUserApi = "https://finance-87242397968.us-central1.run.app/user";
  const deleteUserApi = `https://finance-87242397968.us-central1.run.app/user/${userId}`;
  const navigate = useNavigate();

  // Fetch profile data from backend
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios
      .get(getUserApi.concat("/") + userId)
      .then((response) => {
        console.log(response);
        setProfile(response.data);
        setOriginalProfile(response.data);
        localStorage.setItem("userName", profile.name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleClose = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
  };

  const handleSaveChanges = () => {
    profile.password = null;
    axios
      .put(getUserApi.concat("/") + userId, profile)
      .then((response) => {
        console.log(response);
        localStorage.setItem("userName", response.data.name);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          alert("User Not Found");
        } else {
          alert("Fail to update profile.");
        }
      });
  };

  const handleDeleteAccount = async () => {
    axios
      .delete(deleteUserApi)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      });
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // Redirect to home page
    navigate("/"); // You can navigate to any page, e.g., Home
  };

  return (
    <div>
      <div className="container profile-container mt-5">
        <div className="card rounded profile-card">
          <div className="card-body text-center">
            <div className="profile-avatar mb-4">
              <i className="fa fa-user-circle fa-5x" aria-hidden="true"></i>
            </div>
            <div className="form-group row mb-4 me-3 profile-form">
              <label
                htmlFor="name"
                className="col-3 col-form-label text-white profile-label"
              >
                Name
              </label>
              <div className="col-9">
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={profile.name}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group row mb-4 me-3 profile-form">
              <label
                htmlFor="email"
                className="col-3 col-form-label text-white profile-label"
              >
                Email
              </label>
              <div className="col-9">
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={profile.email}
                  readOnly
                />
              </div>
            </div>

            <button
              className="mt-3 border-rounded profile-btn"
              data-bs-toggle="modal"
              data-bs-target="#editProfileModal"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="text-start mt-5">
          <h4 className="mb-3">Account Management</h4>
          <p>
            Logging out will end your current session. You will need to log in
            again to access your account, but your data will remain intact and
            unaffected.
          </p>
          <button
            className="btn profile-btn"
            data-bs-toggle="modal"
            data-bs-target="#logoutConfirmationModal"
          >
            Log Out
          </button>{" "}
          <p className="mt-3">
            Deleting your account means removing all of your data from your
            account permanently and you cannot log in it again at any time.
          </p>
          <button
            className="btn btn-danger mt-3 ml-3 mb-5"
            data-bs-toggle="modal"
            data-bs-target="#deleteAccountModal"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Modal for Editing Profile */}
      <div
        className="modal fade"
        id="editProfileModal"
        tabIndex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content edit-profile-popup">
            <h5
              className="modal-title fw-bold m-auto mt-3 edit-profile-title"
              id="editProfileModalLabel"
            >
              Edit Profile
            </h5>

            <div className="modal-body">
              <form>
                <div className="form-group row mb-3 profile-form">
                  <label htmlFor="name" className=" col-2 text-start">
                    Name
                  </label>
                  <div className="col-10">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={profile.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3 profile-form">
                  <label htmlFor="email" className="col-2 text-start">
                    Email
                  </label>
                  <div className="col-10">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={profile.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="mb-5 Edit-form-btn">
              <button
                type="button"
                className="btn me-3 cancel-btn"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn save-btn"
                onClick={handleSaveChanges}
                data-bs-dismiss="modal"
              >
                Save{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Logout Confirmation */}
      <div
        className="modal fade"
        id="logoutConfirmationModal"
        tabIndex="-1"
        aria-labelledby="logoutConfirmationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content logout-modal">
            <div className="modal-header">
              <h5
                className="modal-title mt-3"
                id="logoutConfirmationModalLabel"
                style={{ fontWeight: 500 }}
              >
                Are you sure you want to logout?
              </h5>
            </div>
            <div className="modal-body">
              <p style={{ fontWeight: 500 }}>
                If you log out, you will need to log in again to access your
                account.
              </p>
            </div>
            <div className="logout-modal-footer">
              <button
                type="button"
                className="btn me-3 cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn save-btn"
                onClick={handleLogout}
                data-bs-dismiss="modal"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* LogOut Modal End */}

      {/* Modal for Delete Account Confirmation */}
      <div
        className="modal fade"
        id="deleteAccountModal"
        tabIndex="-1"
        aria-labelledby="deleteAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h5
                className="modal-title mt-3"
                id="deleteAccountModalLabel"
                style={{ fontWeight: 500 }}
              >
                Are you sure you want to delete your account?
              </h5>
            </div>
            <div className="modal-body">
              <p style={{ fontWeight: 500 }}>
                Deleting your account will remove all data permanently. This
                action cannot be undone.
              </p>
            </div>
            <div className="modal-footer d-flex justify-content-center mb-3">
              <button
                type="button"
                className="btn me-2 cancel-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger delete-btn"
                onClick={handleDeleteAccount}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
