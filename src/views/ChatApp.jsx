import React, { useState, useEffect } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import io from 'socket.io-client';
import { useAuth } from '../provider/AuthProvider';
import useFetchWithToken from '../hooks/useFetch';
import { fetchWithToken } from '../services/api';

const socket = io.connect(process.env.REACT_APP_BACKEND_SOCKET);

export const ChatApp = () => {
  const { userInfo } = useAuth()
  const { data: friends } = useFetchWithToken(`/amistad/amigos/${userInfo.id}`)

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState({});

  useEffect(() => {

    socket.emit("getOnlineFriends", { id: userInfo.id, socketId: socket.id });

    socket.on("onlineFriends", (data) => {
      setFriends(data.friends);
      setConnectedUsers(data.connectedUsers); // Lista de usuarios en línea
    });

    socket.on("nuevoMensaje", (message) => {
      

      if(selectedFriend == null) {
        //alert("Nuevo mensaje "+message.name)
        return;
      };
      if (selectedFriend && message.senderId == selectedFriend.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }else{
        //alert("Nuevo mensaje "+message.name)
      }
    });

    return () => {
      socket.off("disconnect");
      socket.off("getOnlineFriends");
      socket.off("receiveMessage");
    };
  }, [selectedFriend]);

  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
    setMessages([]);
    try {
      const response = await fetchWithToken(`/mensajes/${userInfo.id}/${friend.id}`)
      const data = await response.json()
      if (!response.ok) return;
      const loadMessages = data?.map(m => {
        return {
          text: m.contenido,
          sentTime: m.createdAt,
          senderId: m.enviadoPorId,
        }
      });
      setMessages(loadMessages)
    } catch (e) {
      setMessages([]);
    }
  };

  const handleSendMessage = (text) => {
    if (selectedFriend) {
      const message = { senderId: socket.id, receiverId: selectedFriend.id, text, userId: userInfo.id, userReceiveId: selectedFriend.id };
      socket.emit("enviarMensaje", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: '100%',
    }}>
      <MainContainer>

        <Sidebar position="left" scrollable>
          <ConversationList>
            {friends?.map((f) => {
              const friend = f.usuarioEnvia.id == userInfo.id ? f.usuarioRecibe : f.usuarioEnvia
              return (
                <Conversation
                  key={friend.id}
                  name={friend.nombre}
                  onClick={() => handleSelectFriend(friend)}
                  active={friend.id === selectedFriend?.id}
                  info={connectedUsers[friend.id] ? "En línea" : "Desconectado"}
                >
                  <Avatar src={process.env.REACT_APP_BACKEND_URL + "/" + friend.foto} status={connectedUsers[friend.id] ? "available" : "unavailable"} />
                </Conversation>
              )
            })
            }
          </ConversationList>
        </Sidebar>

        {/* Contenedor de Chat */}
        <ChatContainer>
          <MessageList>
            {messages?.filter(f=>f.senderId == selectedFriend?.id || f.senderId == userInfo.id || f.senderId === socket.id).map((msg, index) => {
              return (
                <Message
                  key={index}
                  model={{
                    message: msg.text,
                    sentTime: msg.sentTime,
                    sender: (msg.senderId == userInfo.id || msg.senderId === socket.id) ? "Yo" : selectedFriend?.name,
                    direction: (msg.senderId == userInfo.id || msg.senderId === socket.id) ? "outgoing" : "incoming",
                    //sender: msg.senderId === socket.id ? "Yo" : selectedFriend?.name,
                    //direction: msg.senderId === socket.id ? "outgoing" : "incoming",
                  }}
                />
              )
            })}
          </MessageList>
          <MessageInput
            placeholder="Escribe tu mensaje..."
            attachButton={false}
            onSend={handleSendMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
