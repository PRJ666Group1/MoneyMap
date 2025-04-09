"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Chat() {
  const { ipcRenderer } = window.electron;
    const initialMessage = {
        role: "assistant",
        content: "Hi! I'm your MoneyMap assistant. How can I help you today?",
    };

    const initialData = async () => {
        let data = await ipcRenderer.invoke("export-json");

        return {
            role: "system",
            content: JSON.stringify(data.data)
        }
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [savedChats, setSavedChats] = useState({});
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedChats")) || {};
        setSavedChats(saved);

        const wasActive = sessionStorage.getItem("activeChatId");
        if (wasActive && saved[wasActive]) {
            setMessages(saved[wasActive]);
            setChatId(wasActive);
        } else {
            const newId = Date.now().toString();
            setMessages([initialMessage]);
            setChatId(newId);
        }
    }, []);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const loadInitialData = await initialData();
        console.log(loadInitialData)
        const newMessages = [...messages, loadInitialData, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("https://moneymap.fadaei.dev/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer supersecret123",
              },
              body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();

            const aiMessage = {
                role: "assistant",
                content:
                    typeof data === "string"
                        ? data
                        : data.output || "Sorry, something went wrong.",
            };

            const updatedMessages = [...newMessages, aiMessage];
            setMessages(updatedMessages);

            const updatedChats = {
                ...savedChats,
                [chatId]: updatedMessages,
            };
            setSavedChats(updatedChats);
            localStorage.setItem("savedChats", JSON.stringify(updatedChats));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startNewChat = () => {
        const newId = Date.now().toString();
        setMessages([initialMessage]);
        setInput("");
        setChatId(newId);
        sessionStorage.setItem("activeChatId", newId);
    };

    const loadChat = (id) => {
        setChatId(id);
        setMessages(savedChats[id]);
        sessionStorage.setItem("activeChatId", id);
    };

    const saveChatManually = () => {
        const updatedChats = {
            ...savedChats,
            [chatId]: messages,
        };
        setSavedChats(updatedChats);
        localStorage.setItem("savedChats", JSON.stringify(updatedChats));
        alert("Chat saved locally!");
    };

    const deleteChat = (id) => {
        if (confirm("Are you sure you want to delete this chat?")) {
            const updatedChats = { ...savedChats };
            delete updatedChats[id];
            setSavedChats(updatedChats);
            localStorage.setItem("savedChats", JSON.stringify(updatedChats));

            if (chatId === id) {
                sessionStorage.removeItem("activeChatId");
                startNewChat();
            }
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
            <div style={{ flex: 3, padding: 20 }}>
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: 16,
                        height: "80vh",
                        overflowY: "auto",
                        borderRadius: 8,
                        marginBottom: 12,
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: 12,
                                textAlign: msg.role === "user" ? "right" : "left",
                                display: msg.role === "system" ? "none" : "block"
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    background: msg.role === "user" ? "#DCF8C6" : "#E9E9EB",
                                    color: "#333",
                                    padding: "10px 14px",
                                    borderRadius: 16,
                                    maxWidth: "80%",
                                }}
                            >
                                {msg.role === "assistant" ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ fontStyle: "italic", color: "#888" }}>Typing...</div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                <textarea
                    rows={2}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        resize: "none",
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        marginTop: 8,
                        padding: "10px 16px",
                        borderRadius: 8,
                        background: "#0070f3",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                    }}
                    disabled={loading}
                >
                    Send
                </button>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                        onClick={startNewChat}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: 8,
                            background: "#f5f5f5",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                        }}
                    >
                        New Chat
                    </button>

                    <button
                        onClick={saveChatManually}
                        style={{
                            flex: 1,
                            padding: "10px 16px",
                            borderRadius: 8,
                            background: "#34a853",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Save Chat
                    </button>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    borderLeft: "1px solid #ccc",
                    padding: 20,
                    background: "#fafafa",
                    overflowY: "auto",
                }}
            >
                <h3 style={{ marginTop: 0 }}>Saved Chats</h3>
                {Object.keys(savedChats).length === 0 && <p>No saved chats.</p>}
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {Object.entries(savedChats).map(([id, msgs]) => (
                        <li
                            key={id}
                            style={{
                                marginBottom: 10,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <button
                                onClick={() => loadChat(id)}
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    padding: 10,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                    background: id === chatId ? "#e0e0e0" : "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                {new Date(Number(id)).toLocaleString()}
                            </button>
                            <button
                                onClick={() => deleteChat(id)}
                                style={{
                                    marginLeft: 8,
                                    border: "none",
                                    background: "#ff4d4d",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: 30,
                                    height: 30,
                                    cursor: "pointer",
                                }}
                                title="Delete Chat"
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
