import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth.token]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mon Profil</h1>
      {profile ? (
        <div>
          <p>
            <strong>Nom d'utilisateur:</strong> {data.name}
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
