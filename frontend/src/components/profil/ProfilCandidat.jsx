// --- IMPORTS ---
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHttpClient } from "../../hooks/http-hook";

import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Spinner from "../UIElements/LoadingSpinner";

import "./ProfilCandidat.css";

// --- DEDFAULT FUNCTION ---
export default function UserProfileC() {
  const [profile, setProfile] = useState(null);
  const [retour, setRetour] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { user, token, logout } = useAuthContext();
  const navigate = useNavigate();

  // --- SUPPRESSION ---
  const [btnDel, setBtnDel] = useState(false);
  const delAccount = async () => {
    try {
        const resData = await sendRequest(
            `https://jobbang-ke8e.onrender.com/api/employees/${user._id}`,
            "DELETE",
            null,
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        );
    } catch (e) {
        console.error(e);
    } finally {
        setRetour(true);
        logout();
        navigate("/offreEmploi");
    }

  }

  // --- INFOS PROFIL ---
  useEffect(() => {
    const cId = user._id;

    const getLoggedUser = async () => {
        try {
            const resData = await sendRequest(
                `https://jobbang-ke8e.onrender.com/api/employees/${cId}`,
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

    {retour === true ? (<Navigate to="/offreEmploi" />) : null}

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

    <div className="btnPopup">
        {/* Suppression */}
        <div 
            id="del"
            onClick={() => (btnDel ? setBtnDel(false) : setBtnDel(true)) }>
            Supprimer le compte
        </div>
    </div>

    {btnDel ? 
    (
        <div className="confirm">
            <p>Voulez-vous vraiment supprimer votre compte de façon permanente?</p>
            <div className="oui" onClick={delAccount}>Supprimer</div>

        </div>
    ) : null}
        
    
    
    </>
  );
};

