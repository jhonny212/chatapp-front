import { Avatar, DarkThemeToggle, Dropdown, Flowbite, Navbar, useThemeMode } from 'flowbite-react'
import { useAuth } from '../../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BellAlertIcon } from '@heroicons/react/16/solid';
import useFetchWithToken from '../../hooks/useFetch';


export const NavBarLayout = () => {
    const { logout, userInfo } = useAuth();
    const navigate = useNavigate();
    const {data: notifications} = useFetchWithToken(`/noti/${userInfo.id}`)

    return (
        <Navbar fluid className='shadow-md dark:shadow-none'>
            <div className="flex items-center gap-4">

                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img={`${process.env.REACT_APP_BACKEND_URL}/${userInfo.foto}`} rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{userInfo.name}</span>
                        <span className="block truncate text-sm font-medium">{userInfo.nombre}</span>
                        <Flowbite>
                            <DarkThemeToggle />
                        </Flowbite>
                    </Dropdown.Header>
                    <Dropdown.Item href='/perfil'>Editar perfil</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {
                        logout();
                        navigate('/');
                    }}>Sign out</Dropdown.Item>
                </Dropdown>

                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <div className="relative">
                           <BellAlertIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                             
                            {notifications?.length > 0 && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                                    <span className="text-white text-xs">{notifications?.length}</span>
                                </div>
                            )}
                        </div>
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm font-medium">Notificaciones</span>
                    </Dropdown.Header>
                    {notifications?.map((notification) => (
                        <Dropdown.Item key={notification.id}>
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{notification.notificacion}</p>
                                {/* <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p> */}
                            </div>
                        </Dropdown.Item>
                    ))}
                </Dropdown>

            </div>

            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="/home">Inicio</Navbar.Link>
                <Navbar.Link href="/chat">Chat</Navbar.Link>
                <Navbar.Link active>
                    <Dropdown inline arrowIcon={false} label={"Amigos"}>
                        <Dropdown.Item>
                            <Navbar.Link href='/amigos/buscar'>
                                Agregar nuevos amigos
                            </Navbar.Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Navbar.Link href='/amigos/solicitudes'>
                                Solicitudes
                            </Navbar.Link>
                        </Dropdown.Item>

                        <Dropdown.Item>
                            <Navbar.Link href='/amigos'>
                                Amigos
                            </Navbar.Link>
                        </Dropdown.Item>

                    </Dropdown>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
