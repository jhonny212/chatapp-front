import React, { useState } from 'react';
import { Button, Label, TextInput, FileInput } from 'flowbite-react';
import { useAuth } from '../provider/AuthProvider';
import useFetchWithToken from '../hooks/useFetch';
import { fetchWithToken } from '../services/api';

export const EditProfile = () => {
    const { userInfo, updateUserInfo } = useAuth()
    const [name, setName] = useState(userInfo.nombre);
    const [intereses, setIntereses] = useState(userInfo.intereses)
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(process.env.REACT_APP_BACKEND_URL+"/"+userInfo.foto);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nombre', name);
            formData.append('foto', profilePicture); 
            formData.append("intereses",intereses)

            const response = await fetchWithToken(`/user/${userInfo.id}`, {
                method: "PUT",
                body: formData
            },"")

            if(response.ok){
                alert("Perfil actualizado")
                const data = await response.json()
                delete data["password"]
                updateUserInfo(data)
                return;
            }

            alert("No se pudo actualizar el perfil, intente de nuevo")

        } catch(er) {
            alert("Error al actualizar perfil")
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <TextInput
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Ingresa tu nombre"
                        required
                    />
                </div>

                <div>
                    <TextInput
                        id="name"
                        type="text"
                        value={intereses}
                        onChange={(ev) => setIntereses(ev.target.value)}
                        placeholder="Ingresa tu interes"
                        required
                    />
                </div>

                <div>
                    <FileInput
                        id="profile-picture"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                {preview && (
                    <div className="mt-4">
                        <img src={preview} alt="Previsualización" className="mt-2 w-32 h-32 rounded-full" />
                    </div>
                )}

                <Button type="submit">Guardar Cambios</Button>
            </form>
        </div>
    );
};
