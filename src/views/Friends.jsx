import { Card } from 'flowbite-react'
import React from 'react'
import useFetchWithToken from '../hooks/useFetch'
import { useAuth } from '../provider/AuthProvider'

export const Friends = () => {
    const { userInfo } = useAuth()
    const { data: friends } = useFetchWithToken(`/amistad/amigos/${userInfo.id}`)
    console.log(friends);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Mis Amigos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends?.map((friend, index) => (
                    <div key={index} className="flex">
                        <Card className="flex-1 h-full transform transition-transform duration-300 hover:scale-105">
                            <img
                                className="rounded-t-lg h-48 w-full object-cover"
                                src={process.env.REACT_APP_BACKEND_URL + "/" + friend.usuarioEnvia.foto}
                                alt={`${friend.usuarioEnvia.nombre}'s photo`}
                            />
                            <div className="p-5 flex flex-col justify-between h-full">
                                <div>
                                    <h5 className="text-xl font-semibold dark:text-gray-200">{friend.usuarioEnvia.nombre}</h5>
                                    <p className="text-sm text-gray-600 dark:text-white">{friend.usuarioEnvia.email}</p>
                                    <h6 className="mt-3 font-medium dark:text-white">Intereses:</h6>
                                    <p className='dark:text-gray-400'>{friend.usuarioEnvia.intereses}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}
