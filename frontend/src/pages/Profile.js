import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token", decodedToken);
      const userId = decodedToken.userId;
      console.log("User ID:", userId);

      const response = await fetch(
        `http://localhost:3001/api/profile/${userId}`,
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

  return (
    <div>
      <h1>Profile</h1>
      {profile ? (
        <div>
          <p>Username: {profile.username}</p>
          <p>Bio: {profile.bio}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
