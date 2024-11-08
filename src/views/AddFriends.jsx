import React, { useState } from 'react';
import { Button, ListGroup, Alert, TextInput } from 'flowbite-react';
import useFetchWithToken from '../hooks/useFetch';
import { useAuth } from '../provider/AuthProvider';
import ToastMessage from '../components/common/ToastMessage';
import { fetchWithToken } from '../services/api';

export const AddFriends = () => {
  const [query, setQuery] = useState('');
  const { userInfo } = useAuth();
  const { data: users, error, loading, refetch, updateUrl } = useFetchWithToken(`/user/searchfriends?query=${query}&userId=${userInfo.id}`)
  const [showToast, setShowToast] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault();
    updateUrl(`/user/searchfriends?query=${query}&userId=${userInfo.id}`)
    refetch()
  };

  const handleSendRequest = async (userId) => {
    try{
      const response = await fetchWithToken("/amistad/solicitud", {
        "method": "POST",
        "body": JSON.stringify({
          "usuarioEnviaId": userInfo.id,
          "usuarioRecibeId": userId
        })
      })

      const data = await response.json();
      if(response.ok){
        alert("Solicitud enviada")
        refetch()
        return;
      }

      alert(data.error,)
    
    }catch(err){
      alert(err)
    }
  };

  const handleCloseToast = () => {
    setShowToast(null); // Ocultar el toast
  };

  return <>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buscar Amigos</h1>
      <form onSubmit={handleSearch} className="mb-4 b">
        <TextInput
          type="text"
          placeholder="Buscar por nombre de usuario"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" className="ml-2 mt-2">
          Buscar
        </Button>
      </form>

      {error && <Alert color="failure" className="mt-4">{error}</Alert>}

      {users && users.length > 0 && (
        <ListGroup>
          {users
            .map((user) => (
              <ListGroup.Item key={user.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <ProfilePicture imageUrl={process.env.REACT_APP_BACKEND_URL+"/"+user.foto} /> {/* Aquí se agrega el componente de imagen */}
                  <div className="ml-3"> {/* Espaciado entre la imagen y el texto */}
                    <h5 className="text-lg font-semibold">{user.nombre}</h5>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button onClick={() => handleSendRequest(user.id)} color="primary">
                  Enviar solicitud
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}

      {users?.length === 0 && !error && (
        <p className="mt-4 text-gray-500">No se encontraron usuarios.</p>
      )}
    </div>
  </>
};


const ProfilePicture = ({ imageUrl }) => {
  const defaultImage = 'https://via.placeholder.com/50'; // Cambia a una imagen por defecto si no hay

  return (
    <img
      src={imageUrl || defaultImage}
      alt="Perfil"
      className="w-10 h-10 rounded-full border border-gray-300"
    />
  );
};