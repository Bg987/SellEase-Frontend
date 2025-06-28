// 🔹 React ChatPage Component with AI Suggestion System Integrated

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
    Box, TextField, Button, Typography, List, ListItem, ListItemText,
    Divider, IconButton
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { chatHistory, chatSeen, SetName, GetName } from "../services/api";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const socket = io("//https://sellease-backend.onrender.com", { transports: ["websocket", "polling"] });

const ChatPage = () => {
    const location = useLocation();
    const item = location.state?.item;
    const sellerId = item?.userId;
    const name = item?.NAME;
    const itemName = item?.itemName;
    const senderId = localStorage.getItem("userId");

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(itemName ? `Interested in ${itemName}` : "");
    const [customSellerName, setCustomSellerName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const messageListRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCustomSellerName((name !== sellerId) ? name : "user");
    }, [sellerId, itemName]);

    useEffect(() => {
        if (!name) {
            const getName = async () => {
                const res = await GetName(sellerId);
                if (res.status === 200) {
                    setCustomSellerName(res.data.name.friendName);
                } else {
                    setCustomSellerName("user");
                }
            };
            getName();
        }
    }, []);

    useEffect(() => {
        if (!sellerId) return;
        socket.emit("join", senderId);
        const markMessagesAsSeen = async () => {
            try {
                await chatSeen(sellerId);
            } catch (err) {
                console.error("Error marking messages as seen", err);
            }
        };

        const fetchMessages = async () => {
            try {
                const res = await chatHistory(sellerId);
                const allMessages = res.data;
                setMessages(allMessages);

                const lastMsg = allMessages[allMessages.length - 1];

                // ✅ Trigger suggestion only if the last message is from the other user (i.e., to the current user)
                if (lastMsg && lastMsg.receiverId === senderId && lastMsg.senderId === sellerId) {
                     setIsLoadingSuggestions(true);
                    console.log("Last message is for user → triggering suggestion");
                    socket.emit("requestSuggestions", {
                        senderId,
                        receiverId: sellerId
                    });
                }

            } catch (err) {
                console.error("Error fetching messages", err);
            }
        };


        markMessagesAsSeen();
        fetchMessages();

        socket.on("receiveMessage", (newMessage) => {
            if (
                (newMessage.senderId === sellerId && newMessage.receiverId === senderId) ||
                (newMessage.senderId === senderId && newMessage.receiverId === sellerId)
            ) {
                setMessages(prev => [...prev, newMessage]);
                markMessagesAsSeen();

                // ✅ Only show suggestions if message is incoming (from seller)
                if (newMessage.senderId === sellerId) {
                    setIsLoadingSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            }
        });

        socket.on("aiSuggestions", (suggestions) => {
            setSuggestions(suggestions);
            setIsLoadingSuggestions(false);
        });
        return () => {
            socket.off("receiveMessage");
            socket.off("aiSuggestions");
        };
    }, [sellerId]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (customText) => {
        const finalMsg = customText ?? message;
        if (!finalMsg.trim()) return;

        const newMsg = {
            senderId,
            receiverId: sellerId,
            message: finalMsg,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMsg]);
        socket.emit("sendMessage", newMsg);
        setMessage("");
        setSuggestions([]); // clear suggestions on send
    };

    const handleSuggestionClick = (text) => {
        sendMessage(text);
    };

    const formatDate = (timestamp) => {
        const date = dayjs(timestamp);
        if (date.isToday()) return "Today";
        if (date.isYesterday()) return "Yesterday";
        return date.format("MMM D, YYYY");
    };

    const groupedMessages = messages.reduce((acc, msg) => {
        const dateLabel = formatDate(msg.timestamp);
        if (!acc[dateLabel]) acc[dateLabel] = [];
        acc[dateLabel].push(msg);
        return acc;
    }, {});

    const saveSellerName = async () => {
        if (sellerId && customSellerName) {
            try {
                const res = await SetName(sellerId, customSellerName);
                if (res.data.success) {
                    setCustomSellerName(customSellerName);
                    setIsEditingName(false);
                }
            } catch (err) {
                alert("Error in change name feature");
            }
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: { xs: "100%", sm: 700 }, margin: "auto", bgcolor: "#f5f5f5" }}>
            {/* Header */}
            <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: "white", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/buy")}>Buy</Button>
                    <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/messages")}>Messages</Button>
                    {isEditingName ? (
                        <TextField value={customSellerName} onChange={(e) => setCustomSellerName(e.target.value)} onBlur={saveSellerName} onKeyDown={(e) => e.key === "Enter" && saveSellerName()} size="small" autoFocus sx={{ maxWidth: 200 }} />
                    ) : (
                        <Typography variant="h6">Chat with {customSellerName}</Typography>
                    )}
                    <IconButton onClick={() => setIsEditingName(true)}><Edit /></IconButton>
                </Box>
            </Box>

            {/* Messages List */}
            <Box ref={messageListRef} sx={{ flexGrow: 1, overflowY: "auto", padding: "12px", marginTop: "60px", marginBottom: (suggestions.length > 0 || isLoadingSuggestions) ? "140px" : "60px" }}>
                <List>
                    {Object.entries(groupedMessages).map(([dateLabel, msgs], idx) => (
                        <Box key={idx}>
                            <Typography variant="caption" sx={{ display: "block", textAlign: "center", marginY: 1, fontWeight: "bold" }}>{dateLabel}</Typography>
                            <Divider />
                            {msgs.map((msg, index) => (
                                <ListItem key={index} sx={{ justifyContent: msg.senderId === sellerId ? "flex-start" : "flex-end" }}>
                                    <ListItemText
                                        primary={msg.message}
                                        secondary={dayjs(msg.timestamp).format("hh:mm A")}
                                        sx={{ backgroundColor: msg.senderId === sellerId ? "#f1f1f1" : "#dcf8c6", padding: "8px 12px", borderRadius: "10px", maxWidth: "70%" }}
                                    />
                                </ListItem>
                            ))}
                        </Box>
                    ))}
                </List>
            </Box>

            {/* AI Suggestions Box */}
            {(suggestions.length > 0 || isLoadingSuggestions) && (
                <Box sx={{ position: "fixed", bottom: "70px", left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, padding: "8px", backgroundColor: "#fff", zIndex: 1200, boxShadow: "0px -2px 8px rgba(0,0,0,0.1)" }}>
                    {isLoadingSuggestions ? (
                        <Typography variant="caption">Generating smart replies...</Typography>
                    ) : (
                        suggestions.map((s, idx) => (
                            <Button key={idx} variant="outlined" size="small" onClick={() => handleSuggestionClick(s)}>{s}</Button>
                        ))
                    )}
                </Box>
            )}

            {/* Input Bar */}
            <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", gap: 1, padding: "12px", backgroundColor: "white", borderTop: "1px solid #ccc" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button variant="contained" onClick={() => sendMessage()} sx={{ minWidth: 100 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
