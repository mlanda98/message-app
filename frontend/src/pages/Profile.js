import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useResolvedPath } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({username: "", bio: ""});
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserID] = useState(null);
  const [token, setToken] = useState("");
  
  

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setToken(token);
      console.log("Decoded Token", decodedToken);
      setUserID(decodedToken.userId);
      console.log("User ID:", userId);

      const response = await fetch(
        `http://localhost:3001/api/profile/${decodedToken.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Error fetching profile:", error);
      }
      const data = await response.json();
      console.log("fetched profile data", data);
      setProfile(data);
    };
    fetchProfile();
  }, []);
  
  const handleUpdate = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch(`http://localhost:3001/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({username, bio}),
      })
      const data = await response.json();

      if (response.ok){
        setProfile(data);
        setIsEditing(false);
      } else{
        console.error("Error updating profile:", data.error);
      }
    } catch (error){
      console.error("Error updating profile:", error)
    }
  }

  return (
    <div>
      <h1>Profile</h1>
      {!isEditing ? (
        <div>
          <h2>Profile</h2>
          <p>Username: {profile.username}</p>
          <p>Bio: {profile.bio}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <h2>Edit Profile</h2>
          <label>
            Username:
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          </label>
          <label>
            Bio:
            <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <button type="submit">Update Profile</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
  <a href="/dashboard">Go to dashboard</a>
    </div>
  );
};

export default Profile;
