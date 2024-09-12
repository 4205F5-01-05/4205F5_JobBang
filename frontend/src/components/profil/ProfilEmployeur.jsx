import React, { useState, useEffect } from "react";
import DataEmployeur from "../../data/DataEmployeur";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = () => {
      try {
        setTimeout(() => {
          setProfile(DataEmployeur[0]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError("Failed to load profile data");
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
