import React, { useEffect, useState } from "react";
import axios from "axios";
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/Profil",
          "POST"
        );
        setProfile(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  if (loading) return <p>Chargement...</p>;
  if (error)
    return (
      <p>
        Veuillez vous connecter pour accéder à votre profil: {error.message}
      </p>
    );
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

          {/* Ajoutez d'autres informations selon vos besoins */}
        </div>
      ) : (
        <p>Aucune information sur le profil disponible</p>
      )}
    </div>
  );
};

export default UserProfile;
