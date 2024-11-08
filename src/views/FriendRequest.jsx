import React, { useEffect, useState } from 'react';
import useFetchWithToken from '../hooks/useFetch';
import { useAuth } from '../provider/AuthProvider';
import { Button, Card } from 'flowbite-react';
import { fetchWithToken } from '../services/api';
import ToastMessage from '../components/common/ToastMessage';

export const FriendRequest = () => {
  const { userInfo } = useAuth()
  const { data: solicitudes, refetch } = useFetchWithToken(`/amistad/pendientes/${userInfo.id}`)
  const [showToast, setShowToast] = useState(null)

  const aceptarSolicitud = async (id) => {
    try {
      const response = await fetchWithToken(`/amistad/aceptar/${id}`, { "method": "PUT" })
      const data = await response.json()
      
      if (!response.ok) {
        alert("Error al aceptar intente de nuevo")
        return;
      }

      alert("Solicitud de amistad aceptada")
      refetch()

    } catch (error) {
    }
  };

  const rechazarSolicitud = async (id) => {
    try {
      const response = await fetchWithToken(`/amistad/rechazar/${id}`, { "method": "DELETE" })
      if (!response.ok) {
        alert("Error al rechazar intente de nuevo")
        return;
      }

      alert("Solicitud de amistad rechazada")
      refetch()

    } catch (error) {

    }
  };
  
  const handleCloseToast = () => {
    setShowToast(null); 
  };

  return <>
    {showToast && 
    (
      <ToastMessage
        message={showToast.message}
        type={showToast.type}
        onClose={handleCloseToast}
      />
    )
    }
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Solicitudes de Amistad Recibidas</h2>
      {solicitudes?.length === 0 ? (
        <p>No tienes solicitudes de amistad.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {solicitudes?.map(solicitud => (
            <Card key={solicitud.usuarioEnviaId} className="p-4 shadow-md">
              <h5 className="text-lg dark:text-white font-semibold">
                {solicitud.usuarioEnvia.email} te ha enviado una solicitud de amistad.
              </h5>
              <div className="mt-4 flex space-x-2">
                <Button
                  onClick={() => aceptarSolicitud(solicitud.id)}
                  color="success"
                >
                  Aceptar
                </Button>
                <Button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  color="failure"
                >
                  Rechazar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  </>
};