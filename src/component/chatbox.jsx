import React, { useState } from "react";
import "./chatbox.css";

const Chatbox = () => {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const API_KEY = import.meta.env.VITE_API_URI;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const handleSend = async () => {
        if (!userInput.trim()) return;

        setChatHistory([...chatHistory, { sender: "User", text: userInput }]);
        setUserInput("");

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }] })
            });

            const data = await res.json();
            const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";


            setChatHistory([...chatHistory, { sender: "User", text: userInput }, { sender: "Bot", text: botReply }]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="chatbox-container">
            <h2 className="chatbox-title">Chatbot</h2>
            <div className="chatbox-history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chatbox-message ${msg.sender.toLowerCase()}`}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <div className="chatbox-input-container">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type a message..." className="chatbox-input" />
                <button onClick={handleSend} className="chatbox-button">Send</button>
            </div>
        </div>
    );
};

export default Chatbox;