import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useRef } from 'react';
import { fetchWithToken } from '../services/api';
import { useAuth } from '../provider/AuthProvider';
import useFetchWithToken from '../hooks/useFetch';
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

export const CreatePost = () => {
    const { userInfo } = useAuth()
    const { data: posts, refetch } = useFetchWithToken(`/post/amigos/${userInfo.id}`)
    const [contenido, setContenido] = useState('');
    const quillRef = useRef(null);

    useEffect(() => {

        if (quillRef?.current) return;

        quillRef.current = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['list', 'bullet'],
                    ['clean'], // remove formatting button
                ],
            },
        });

        quillRef.current.on('text-change', () => {
            setContenido(quillRef.current.root.innerHTML); // Guarda el contenido HTML
        });
    }, []);

    const crearPost = async () => {
        try {
            const response = await fetchWithToken("/post/", {
                "method": "POST",
                "body": JSON.stringify({
                    contenido,
                    usuarioId: userInfo.id
                })
            })
            const data = await response.json()
            if (response.ok) {
                alert("Post creado");
                setContenido("")
                quillRef.current.root.innerHTML = ""
                return
            }

            alert(`Error al crear post ${data?.error}`)
        } catch (error) {
            alert("Error al crear el post:" + error);
        }
    };

    const like = async (postId) => {
        try {
            const response = await fetchWithToken("/likes/toggle", {
                "method": "POST",
                body: JSON.stringify({
                    usuarioId: userInfo.id,
                    postId
                })
            })

            const data = await response.json()
            if (response.ok) {
                alert(data.message)
                refetch()
                return;
            }

            alert(data.error)

        } catch (error) {
            alert("Error al crear el post:" + error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Crear un Post</h2>
            <div id="editor" className="mb-4 border border-gray-300 rounded-lg" style={{ height: '200px' }}></div>
            <Button onClick={crearPost} className='mt-2'>
                Publicar
            </Button>

            <div className="grid grid-cols-1 gap-4 mt-5">
                {posts?.map((post) => {
                    const isLiked = post.likes.some(like => like.usuarioId === userInfo.id);

                    return (
                        <div key={post.id} className="p-4 border rounded-lg shadow-md">
                            <h1> <b>Author: {post.autorId == userInfo.id ? 'Propio': post.autor.nombre} </b></h1>
                            <div dangerouslySetInnerHTML={{ __html: post.contenido }} />
                            <div className="mt-4 flex items-center justify-between">
                                <a href={`/post/${post.id}`} className="text-blue-600 hover:underline"> ver post </a>
                                <div className="flex items-center gap-2">
                                    <div>

                                        <Button onClick={() => { like(post.id) }}
                                            color='primary'
                                            className='bg-gray-200 text-gray-800 flex items-center'>
                                            <FaComment />
                                        </Button>
                                        <p className="ml-2 text-center">{post.comentarios.length}</p>
                                    </div>
                                    <div>
                                        <Button onClick={() => { like(post.id) }}
                                            color='primary'
                                            className='bg-gray-200 text-gray-800 flex items-center'>
                                            {!isLiked ? <AiFillLike /> : <AiFillDislike />}
                                        </Button>
                                        <p className="ml-2 text-center">{post.likes.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
