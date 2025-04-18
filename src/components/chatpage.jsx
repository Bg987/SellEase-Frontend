import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Divider, IconButton } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { chatHistory, chatSeen, SetName, GetName } from "../services/api"; // API calls

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const socket = io("http://192.168.121.47:5000", { transports: ["websocket", "polling"] });

const ChatPage = () => {
    const location = useLocation();
    const item = location.state?.item;
    const sellerId = item?.userId;//seller's/receiver's userid, not logged in userid
    const name = item?.NAME;//friendname from messages page
    const itemName = item?.itemName;//item name if navigate from buy page
    const senderId = localStorage.getItem("userId");//(sender)logged in userid
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(itemName ? `Interested in ${itemName}` : "");//check whether navuigate from buy page or not if from buy page show int.... otherwise show ""
    const [customSellerName, setCustomSellerName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const messageListRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCustomSellerName((name != sellerId) ? name : "user");//if name not save in database name = sellerid so default show user
    }, [sellerId, itemName]);
    useEffect(() => {
        const getName = async () => {
            const res = await GetName(sellerId);
            if (res.status === 200) {
                const name = res.data.name;
                setCustomSellerName(name.friendName);
            }
            else {
                setCustomSellerName("user");
            }
          }
        if (!name) {//check whether user navigate from buy page or not if navigate from there no need to execute getName()
            getName();
        }
    },[])
    useEffect(() => {
        if (!sellerId) return;
        socket.emit("join", senderId);
        const markMessagesAsSeen = async () => {
            try {
                await chatSeen(sellerId);
            } catch (error) {
                console.error("Error marking messages as seen", error);
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await chatHistory(sellerId);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };
        //defauly functions 
        markMessagesAsSeen();
        fetchMessages();
        socket.on("receiveMessage", (newMessage) => {
            if ((newMessage.senderId === sellerId && newMessage.receiverId === senderId) ||
                (newMessage.senderId === senderId && newMessage.receiverId === sellerId)) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                markMessagesAsSeen();
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [sellerId]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const newMessage = {
            senderId,
            receiverId: sellerId,
            message,
            timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("sendMessage", newMessage);
        setMessage("");
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

    // Save custom seller name
    const saveSellerName = async () => {
        if (sellerId && customSellerName) {
            try {
                const res = await SetName(sellerId, customSellerName);//req to server
                if (res.data.success) {
                    setCustomSellerName(customSellerName); // Update UI immediately
                    setIsEditingName(false);
                }
            }
            catch (err) {
                alert("error in change name feature");
                console.log("error = ", err);
            }
        }
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: { xs: "100%", sm: 700 }, margin: "auto", bgcolor: "#f5f5f5" }}>
            {/* Fixed Header with Back Button */}
            <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: "white", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/buy")}>
                        Buy
                    </Button>
                    <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/messages")}>
                        Messages
                    </Button>

                    {isEditingName ? (
                        <TextField
                            value={customSellerName}
                            onChange={(e) => setCustomSellerName(e.target.value)}
                            onBlur={saveSellerName}
                            onKeyDown={(e) => e.key === "Enter" && saveSellerName()}
                            size="small"
                            autoFocus
                            sx={{ maxWidth: 200 }}
                        />
                    ) : (
                        <Typography variant="h6">
                            Chat with {customSellerName}
                        </Typography>
                    )}
                    <IconButton onClick={() => setIsEditingName(true)}><Edit /></IconButton>
                </Box>
            </Box>

            {/* Scrollable Chat Messages */}
            <Box ref={messageListRef} sx={{ flexGrow: 1, overflowY: "auto", padding: "12px", marginTop: "60px", marginBottom: "60px" }}>
                <List>
                    {Object.entries(groupedMessages).map(([dateLabel, msgs], idx) => (
                        <Box key={idx}>
                            <Typography variant="caption" sx={{ display: "block", textAlign: "center", marginY: 1, fontWeight: "bold" }}>
                                {dateLabel}
                            </Typography>
                            <Divider />
                            {msgs.map((msg, index) => (
                                <ListItem key={index} sx={{ justifyContent: msg.senderId === sellerId ? "flex-start" : "flex-end" }}>
                                    <ListItemText
                                        primary={msg.message}
                                        secondary={[
                                            dayjs(msg.timestamp).format("hh:mm A"),
                                            msg.senderId === senderId ? (msg.read ? "- seen" : "not seen") : ""
                                        ].join(" ")}
                                        sx={{
                                            backgroundColor: msg.senderId === sellerId ? "#f1f1f1" : "#dcf8c6",
                                            padding: "8px 12px",
                                            borderRadius: "10px",
                                            maxWidth: "70%",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </Box>
                    ))}
                </List>
            </Box>

            {/* Fixed Message Input */}
            <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", gap: 1, padding: "12px", backgroundColor: "white", borderTop: "1px solid #ccc" }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button variant="contained" onClick={sendMessage} sx={{ minWidth: 100 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
