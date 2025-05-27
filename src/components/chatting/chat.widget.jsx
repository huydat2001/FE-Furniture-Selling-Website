import React, { useState, useEffect, useRef, useContext } from "react";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Typography, Badge, notification } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { AuthContext } from "../../contexts/auth.context";
import { io } from "socket.io-client";
import styled, { keyframes } from "styled-components";

const { Text } = Typography;

// Animation for chat widget slide-in
const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styled components for the chat widget
const ChatContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  max-width: 90vw;
  height: 450px;
  background: linear-gradient(135deg, #ffffff, #f8faff);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 90vw;
    height: 80vh;
  }
`;

const ChatHeader = styled.div`
  padding: 12px 16px;
  background: #1890ff;
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${(props) => (props.isUser ? "#1890ff" : "#e6e6e6")};
  color: ${(props) => (props.isUser ? "white" : "black")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  animation: fadeIn 0.2s ease-in;
  position: relative;

  &:hover .timestamp {
    opacity: 1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Timestamp = styled.div`
  font-size: 10px;
  color: ${(props) => (props.isUser ? "#d9e8ff" : "#888")};
  margin-top: 4px;
  opacity: 0.7;
`;

const ChatFooter = styled.div`
  padding: 12px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
  border-radius: 0 0 12px 12px;
`;

const ChatButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  background: #1890ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const messageEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);
  const userName = user?.username || "guest";

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      notification.error({
        message: "Lỗi xác thực",
        description: "Vui lòng đăng nhập để sử dụng chat.",
      });
      return;
    }

    const newSocket = io("http://localhost:8000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến server chat: " + err.message,
      });
    });

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender === "admin" && msg.receiver === userName && !visible) {
        setIsNewMessage(true);
      }
    });

    newSocket.on("messageRead", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    if (userName !== "guest") {
      axios
        .get(`http://localhost:8000/v1/api/receiver/${userName}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          notification.error({
            message: "Lỗi tải tin nhắn",
            description: err.response?.data?.error || "Không thể tải tin nhắn",
          });
        });
    }

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userName, user._id]);

  useEffect(() => {
    if (visible && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, visible]);

  const handleSend = () => {
    if (
      newMessage.trim() &&
      socket &&
      socket.connected &&
      userName !== "guest"
    ) {
      const msg = {
        sender: userName,
        receiver: "admin",
        content: newMessage,
        timestamp: new Date(),
        isRead: false,
      };
      socket.emit("sendMessage", msg);
      setNewMessage("");
    } else {
      notification.error({
        message: "Lỗi gửi tin nhắn",
        description:
          userName === "guest"
            ? "Vui lòng đăng nhập để gửi tin nhắn"
            : "Kết nối chưa sẵn sàng",
      });
    }
  };

  const handleOpenChat = () => {
    setVisible(!visible);
    if (isNewMessage && socket && userName !== "guest") {
      setIsNewMessage(false);
      messages
        .filter(
          (msg) =>
            msg.sender === "admin" && msg.receiver === userName && !msg.isRead
        )
        .forEach((msg) => socket.emit("markAsRead", { messageId: msg._id }));
    }
  };

  return (
    <>
      <ChatButton onClick={handleOpenChat} role="button" aria-label="Mở chat">
        <Badge dot={isNewMessage}>
          <MessageOutlined style={{ fontSize: 24, color: "white" }} />
        </Badge>
      </ChatButton>

      {visible && (
        <ChatContainer role="dialog" aria-label="Chat hỗ trợ trực tuyến">
          <ChatHeader>
            <Text strong style={{ color: "white" }}>
              Hỗ trợ trực tuyến
            </Text>
            <span
              onClick={() => setVisible(false)}
              style={{ cursor: "pointer", fontSize: 16 }}
              role="button"
              aria-label="Đóng chat"
            >
              ✕
            </span>
          </ChatHeader>
          <ChatBody>
            {messages
              .filter(
                (msg) =>
                  (msg.sender === userName && msg.receiver === "admin") ||
                  (msg.sender === "admin" && msg.receiver === userName)
              )
              .map((msg, index) => (
                <MessageBubble key={index} isUser={msg.sender === userName}>
                  <Text>{msg.content}</Text>
                  <Timestamp isUser={msg.sender === userName}>
                    {dayjs(msg.timestamp).format("HH:mm")}
                  </Timestamp>
                </MessageBubble>
              ))}
            <div ref={messageEndRef} />
          </ChatBody>
          <ChatFooter>
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSend}
              suffix={
                <SendOutlined
                  onClick={handleSend}
                  style={{ cursor: "pointer", color: "#1890ff" }}
                  aria-label="Gửi tin nhắn"
                />
              }
              aria-label="Nhập tin nhắn"
            />
          </ChatFooter>
        </ChatContainer>
      )}
    </>
  );
};

export default ChatWidget;
