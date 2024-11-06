// --- IMPORTS ---
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

// --- DEDFAULT FUNCTION ---
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuthContext();

  useEffect(() => {
    console.log(`User: ${user}`);
    const rId = user._id;
    console.log(`User id: ${rId}`);
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://jobbang-ke8e.onrender.com/api/recruiters/${rId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfile(data.recruiter);
      } catch (error) {
        setError("Failed to load profile data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mon Profil</h1>
      {profile ? (
        <div>
          <p>
            <strong>Nom d'utilisateur:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Entreprise:</strong> {profile.company}
          </p>
          <p>
            <strong>Téléphone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Adresse de l'entreprise:</strong> {profile.companyAddress}
          </p>
        </div>
      ) : (
        <p>Aucune information sur le profil disponible</p>
      )}
    </div>
  );
};

export default UserProfile;
