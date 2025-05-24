import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
const host = "http://localhost:8000";
import "./chat.css";
import { AuthContext } from "../../contexts/auth.context";

const ChattingTest = () => {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState();
  const [userId, setUserId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [clientList, setClientList] = useState([]);
  const [tempClientList, setTempClientList] = useState([]);
  const [statusE, setStatusE] = useState("online");

  const socketRef = useRef();
  const messagesEnd = useRef();
  const chatContainerRef = useRef();
  const { user } = useContext(AuthContext);
  console.log("user :>> ", user);

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }

    socketRef.current = socketIOClient.connect(host, {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketRef.current.on("getId", (data) => {
      console.log("Received getId: ", data);
      setSocketId(data);
      if (userId) {
        socketRef.current.emit("setUserStatus", { userId, statusE });
      }
    });

    socketRef.current.on("clientList", (clients) => {
      console.log("Received clientList: ", clients);
      setTempClientList(clients);
      if (socketId) {
        const filteredClients = clients.filter(
          (clientId) => clientId !== socketId
        );
        if (JSON.stringify(filteredClients) !== JSON.stringify(clientList)) {
          console.log("Client list updated: ", filteredClients);
          setClientList(filteredClients);
        }
      }
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      console.log("Received sendDataServer: ", dataGot);
      setMess((oldMsgs) => [...oldMsgs, dataGot]);
      scrollToBottom();
    });

    socketRef.current.on("newMessage", (message) => {
      console.log("Received newMessage: ", message);
      setMess((oldMsgs) => [...oldMsgs, message]);
      scrollToBottom();
    });

    socketRef.current.on("messageSent", (message) => {
      console.log("Received messageSent: ", message);
      // Đảm bảo message có trường id để so sánh
      setMess((oldMsgs) => {
        const exists = oldMsgs.find((m) => m._id === message._id);
        if (!exists) return [...oldMsgs, message];
        return oldMsgs.map((m) => (m._id === message._id ? message : m));
      });
      scrollToBottom();
    });

    socketRef.current.on("messageQueued", (data) => {
      console.log(
        `Tin nhắn của bạn đang ở vị trí ${data.queuePosition} trong hàng chờ`
      );
      if (data.messageId && data.content) {
        setMess((oldMsgs) => {
          const exists = oldMsgs.find((m) => m._id === data.messageId);
          if (!exists) {
            return [
              ...oldMsgs,
              { _id: data.messageId, content: data.content, status: "queued" },
            ];
          }
          return oldMsgs.map((m) =>
            m._id === data.messageId
              ? { ...m, content: data.content, status: "queued" }
              : m
          );
        });
        scrollToBottom();
      }
    });

    return () => {
      socketRef.current.off("clientList");
      socketRef.current.off("getId");
      socketRef.current.off("sendDataServer");
      socketRef.current.off("newMessage");
      socketRef.current.off("messageSent");
      socketRef.current.off("messageQueued");
      socketRef.current.off("connect_error");
      socketRef.current.disconnect();
    };
  }, [user, statusE]);

  useEffect(() => {
    if (socketId && tempClientList.length > 0) {
      const filteredClients = tempClientList.filter(
        (clientId) => clientId !== socketId
      );
      if (JSON.stringify(filteredClients) !== JSON.stringify(clientList)) {
        console.log("Client list updated after id set: ", filteredClients);
        setClientList(filteredClients);
      }
    }
  }, [socketId, tempClientList]);

  const sendMessage = () => {
    if (message && message.trim() !== "" && userId) {
      socketRef.current.emit("sendMessage", {
        content: message,
        productId: "someProductId",
        senderId: userId,
      });
      setMessage("");
    } else {
      console.error("Message or user ID is missing");
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${
        m.senderId.toString() === userId ? "your-message" : "other-people"
      } chat-item`}
    >
      {m.content}{" "}
      {m.status === "queued" && `(Đang chờ: ${m.queuePosition || "N/A"})`}
    </div>
  ));

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipientId(e.target.value);
  };

  return (
    <div className="box-chat">
      <div className="box-chat_message" ref={chatContainerRef}>
        {renderMess}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>
      <div className="send-box">
        <select
          value={recipientId}
          onChange={handleRecipientChange}
          style={{ marginBottom: "10px" }}
          disabled={!socketId}
        >
          <option value="">Chọn người nhận</option>
          {clientList.map((clientId) => (
            <option key={clientId} value={clientId}>
              {clientId}
            </option>
          ))}
        </select>
        <textarea
          value={message}
          onKeyDown={(e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
              sendMessage();
            }
          }}
          onChange={handleChange}
          placeholder="Nhập tin nhắn ..."
        />
        <button className="btn-submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChattingTest;
