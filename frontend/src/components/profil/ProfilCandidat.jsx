// --- IMPORTS ---
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHttpClient } from "../../hooks/http-hook";

import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Spinner from "../UIElements/LoadingSpinner";

// --- DEDFAULT FUNCTION ---
export default function UserProfileC() {
  const [profile, setProfile] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { user, token } = useAuthContext();

  useEffect(() => {
    const cId = user._id;

    const getLoggedUser = async () => {
        try {
            const resData = await sendRequest(
                `http://localhost:5000/api/employees/${cId}`,
                "GET",
                null,
                {
                Authorization: `Bearer ${token}`,
                }
            );

            setProfile(resData.employee);
            return resData;
        } catch (e) {
            console.error("Une erreur est survenue: ", e);
        }
    };

    getLoggedUser();
  }, []);

  return (
    <>
    <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={clearError} />
    </div>
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
            <strong>Téléphone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Adresse de domicile:</strong> {profile.homeAddress}
          </p>
        </div>
      ) : (
        <p>Aucune information sur le profil disponible</p>
      )}
    </div>
    </>
  );
};

