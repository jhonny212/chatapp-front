import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import useFetchWithToken from '../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { fetchWithToken } from '../services/api';

export const Post = () => {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const { id } = useParams()
  const { data: post, refetch } = useFetchWithToken(`/post/${id}`)
  const { userInfo } = useAuth()

  const handleComentarioChange = (e) => {
    setNuevoComentario(e.target.value);
  };

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    if (nuevoComentario.trim()) {
      try {
        const response = await fetchWithToken("/comentario/", {
          "method": "POST",
          body: JSON.stringify({
            contenido: nuevoComentario,
            usuarioId: userInfo.id,
            postId: post?.id
          })
        })

        if (response.ok) {
          alert("Comentario creado")
          setNuevoComentario('');
          refetch()
          return
        }

        alert("Error al crear comentario, intente de nuevo")

      } catch (error) {
        alert(error)
      }

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

  const removeComment = async (id) => {
    try {
      const response = await fetchWithToken(`/comentario/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Comenario eliminado")
        refetch()
        return;
      }

      alert("Error al eliminar comentario")

    } catch (error) {
      alert("Error al eliminar comentario")
    }
  }

  const isLiked = post?.likes?.some(like => like.usuarioId === userInfo.id);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post Detalle</h2>
      <div className="p-4 border border-gray-300 rounded-lg shadow-md mb-4">
        <div dangerouslySetInnerHTML={{ __html: post?.contenido }} />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button onClick={() => { like(post.id) }}
              color='primary'
              className='bg-gray-200 text-gray-800 flex items-center'>
              {!isLiked ? <AiFillLike /> : <AiFillDislike />}
            </Button>
            <span className="ml-2">{post?.likes.length} Likes</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleComentarioSubmit} className="mb-4">
        <Textarea
          placeholder="Escribe tu comentario aquí..."
          value={nuevoComentario}
          onChange={handleComentarioChange}
          rows={3}
          className="mb-2"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition">
          Comentar
        </Button>
      </form>

      <h3 className="text-xl font-bold mb-2">Comentarios</h3>
      <div className="grid grid-cols-1 gap-4">
        {post?.comentarios?.map((comentario) => {
          const isOwnComentario = comentario.autor.id == userInfo.id
          return (
            <div key={comentario.id} className="p-4 border border-gray-300 rounded-lg shadow-md">
              
              <div className="font-semibold">{comentario.autor?.email}:</div>
              <div>{comentario.contenido}</div>

              <div className='flex gap-2'>
                {isOwnComentario && <Button onClick={()=>{removeComment(comentario.id)}} color='red' className='mt-2' size='xs'>Eliminar comentario</Button>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};