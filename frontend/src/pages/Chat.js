// Chat.js
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


const Chat = () => { 
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  if (!token) {
    console.error("No token found cant fetch messages")
  }
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3001/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok){
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json();
      if (!Array.isArray(data)){
        throw new Error("Unexpected response format")
      }

      console.log("Messages fetched:", data)
      setUsers(data.filter(user => user.id !== userId));
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const response = await fetch("http://localhost:3001/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      setMessages(
        data.filter(
        msg =>
            (msg.senderId === userId && msg.receiverId === selectedUser.id) ||
            (msg.senderId === selectedUser.id && msg.receiverId === userId)
        )
      );
    };
    fetchMessages();
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const response = await fetch("http://localhost:3001/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: selectedUser.id, content }),
    });

    if (response.ok) {
      const newMessage = await response.json();
      setMessages([...messages, newMessage.data]);
      setContent("");
    } else {
      console.error("Error sending message");
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <h2>Users</h2>
        {users.map((user) => (
          <button key={user.id} onClick={() => setSelectedUser(user)}>
            {user.username}
          </button>
        ))}
      </div>

      {selectedUser && (
        <div>
          <h2>Chat with {selectedUser.username}</h2>
          <div style={{border: "1px solid black", padding: "10px", minHeight: "200px"}}>
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.senderId === userId ? "You" : selectedUser.username}:</strong> {msg.content}
            </p>
          ))}
          </div>

          <form onSubmit={sendMessage}>
          <input 
           type="text"
           value={content}
           onChange={(e) => setContent(e.target.value)}
           placeholder="Type a message..."
           />
          <button type="submit">Send</button>
          </form>
          </div>
      )}
    </div>
  )
};

export default Chat;
