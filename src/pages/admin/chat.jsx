import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Input,
  Typography,
  List,
  Avatar,
  Badge,
  notification,
  Button,
} from "antd";
import { DownOutlined, SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import axios from "axios";
import dayjs from "dayjs";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const ChatBoxPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const contentRef = useRef(null);
  const messageEndRef = useRef(null);
  const uniqueUsers = Array.from(
    new Set(
      messages.map((m) => m.sender).filter((name) => name && name !== "admin")
    )
  ).sort((userA, userB) => {
    const latestMessageA = messages
      .filter(
        (msg) =>
          (msg.sender === userA && msg.receiver === "admin") ||
          (msg.sender === "admin" && msg.receiver === userA)
      )
      .reduce(
        (latest, msg) => {
          return new Date(msg.timestamp) > new Date(latest.timestamp)
            ? msg
            : latest;
        },
        { timestamp: "1970-01-01" }
      );

    const latestMessageB = messages
      .filter(
        (msg) =>
          (msg.sender === userB && msg.receiver === "admin") ||
          (msg.sender === "admin" && msg.receiver === userB)
      )
      .reduce(
        (latest, msg) => {
          return new Date(msg.timestamp) > new Date(latest.timestamp)
            ? msg
            : latest;
        },
        { timestamp: "1970-01-01" }
      );

    return (
      new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const newSocket = io("http://localhost:8000", {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("receiveMessage", (msg) => {
      if (msg.sender) {
        setMessages((prev) => {
          const isViewing = currentUser === msg.sender;
          return [
            ...prev,
            { ...msg, isRead: isViewing ? true : false, isNew: !isViewing },
          ];
        });
      } else {
        console.warn("Received message with invalid sender:", msg);
      }
    });

    newSocket.on("messageRead", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true, isNew: false } : msg
        )
      );
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("http://localhost:8000/v1/api/allmessage", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const validMessages = res.data
          .filter((msg) => msg.senderId && msg.receiverId)
          .map((msg) => ({
            ...msg,
            sender: msg.senderId.username,
            receiver: msg.receiverId.username,
          }));

        setMessages(validMessages);
      })
      .catch((err) => {
        console.error("API error:", err.response?.data);
        notification.error({
          message: "Lỗi tải tin nhắn",
          description: err.response?.data?.error || "Không thể tải tin nhắn",
        });
      });
  }, []);

  useEffect(() => {
    if (uniqueUsers.length > 0 && !currentUser) {
      setCurrentUser(uniqueUsers[0]);
    }
  }, [uniqueUsers, currentUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  }, [messages, currentUser]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  };

  const handleSend = () => {
    if (socket && newMessage.trim() && currentUser) {
      const receiver = messages.find((m) => m.sender === currentUser);
      if (!receiver) {
        notification.error({
          message: "Lỗi gửi tin nhắn",
          description: "Người nhận không hợp lệ.",
        });
        return;
      }
      const msg = {
        sender: "admin",
        receiver: currentUser,
        content: newMessage,
        timestamp: new Date(),
        isRead: false,
      };
      socket.emit("sendMessage", msg);
      setNewMessage("");
    }
  };

  const handleSelectUser = (username) => {
    setCurrentUser(username);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender === username && msg.receiver === "admin" && !msg.isRead
          ? { ...msg, isRead: true, isNew: false }
          : msg
      )
    );
    messages
      .filter(
        (msg) =>
          msg.sender === username && msg.receiver === "admin" && !msg.isRead
      )
      .forEach((msg) => socket.emit("markAsRead", { messageId: msg._id }));
  };

  return (
    <Layout style={{ height: "79vh", background: "#f0f2f5" }}>
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid #e0e0e0",
            background: "#1890ff",
            color: "#fff",
          }}
        >
          <Text strong style={{ fontSize: 18 }}>
            Khách hàng
          </Text>
        </div>
        <List
          dataSource={uniqueUsers.map((username) => ({
            key: username,
            username,
          }))}
          renderItem={(item) => {
            const { username } = item;
            const userMessages = messages.filter(
              (msg) =>
                (msg.sender === username && msg.receiver === "admin") ||
                (msg.sender === "admin" && msg.receiver === username)
            );
            const lastMessage = userMessages[userMessages.length - 1];
            const isUnread = userMessages.some(
              (msg) =>
                msg.sender === username &&
                msg.receiver === "admin" &&
                !msg.isRead
            );

            return (
              <List.Item
                key={item.key}
                onClick={() => handleSelectUser(username)}
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  background:
                    currentUser === username ? "#f0f8ff" : "transparent",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f0f8ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    currentUser === username ? "#f0f8ff" : "transparent")
                }
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={isUnread} offset={[-5, 30]} color="#ff4d4f">
                      <Avatar style={{ background: "#1890ff" }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <Text
                      strong={isUnread}
                      style={{ color: isUnread ? "#1890ff" : "#000" }}
                    >
                      {username}
                    </Text>
                  }
                  description={
                    lastMessage ? (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {lastMessage.content} •{" "}
                        {dayjs(lastMessage.timestamp).format("HH:mm")}
                      </Text>
                    ) : (
                      <Text type="secondary">Chưa có tin nhắn</Text>
                    )
                  }
                />
              </List.Item>
            );
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text strong style={{ fontSize: 18 }}>
            {currentUser || "Chọn khách hàng"}
          </Text>
        </Header>
        <Content
          ref={contentRef}
          style={{
            padding: 24,
            background: "#fff",
            overflowY: "auto",
            // position: "relative",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column", // Đảo ngược để tin nhắn mới nhất ở dưới
              gap: 12,
              paddingBottom: 60, // Đảm bảo không che khuất tin nhắn cuối
            }}
          >
            {messages
              .filter(
                (msg) =>
                  currentUser &&
                  ((msg.sender === "admin" && msg.receiver === currentUser) ||
                    (msg.sender === currentUser && msg.receiver === "admin"))
              )
              .map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf:
                      msg.sender === "admin" ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.sender === "admin" ? "#e6f4ff" : "#f0f0f0",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{msg.content}</Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 10,
                        display: "block",
                        textAlign: "right",
                        marginTop: 4,
                      }}
                    >
                      {dayjs(msg.timestamp).format("HH:mm")}
                    </Text>
                  </div>
                </div>
              ))}
            <div ref={messageEndRef} />
          </div>
        </Content>
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e0e0e0",
            background: "#fff",
            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {showScrollButton && (
            <Button
              shape="circle"
              icon={<DownOutlined />}
              style={{
                position: "fixed",
                bottom: 150,
                right: 50,
                zIndex: 1000,
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                color: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "opacity 0.3s",
              }}
              onClick={scrollToBottom}
            />
          )}
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={handleSend}
            suffix={
              <SendOutlined
                onClick={handleSend}
                style={{ cursor: "pointer", color: "#1890ff" }}
              />
            }
            style={{ borderRadius: 20 }}
          />
        </div>
      </Layout>
    </Layout>
  );
};

export default ChatBoxPage;
