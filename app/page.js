"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { role: "user", message };
    setChat([...chat, userMessage]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChat([
        ...chat,
        userMessage,
        { role: "ai", message: data.content },
      ]);
    } catch (error) {
      setChat([
        ...chat,
        userMessage,
        { role: "ai", message: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#343541",
      color: "#ececf1",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        padding: "12px 20px",
        borderBottom: "1px solid #4d4d4f",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#202123"
      }}>
        <h1 style={{
          fontSize: "20px",
          fontWeight: "600",
          margin: "0",
          color: "#ececf1"
        }}>AI Assistant</h1>
      </header>

      {/* Chat Container */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {chat.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#8e8ea0",
            textAlign: "center"
          }}>
            <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>How can I help you today?</h2>
            <p>Ask me anything, from creative ideas to technical explanations.</p>
          </div>
        ) : (
          chat.map((entry, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "16px",
                padding: "12px 0",
                maxWidth: "800px",
                margin: "0 auto",
                width: "100%",
                backgroundColor: entry.role === "ai" ? "#444654" : "transparent",
                borderRadius: "8px",
                padding: "16px",
                alignSelf: entry.role === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: entry.role === "ai" ? "#10a37f" : "#ececf1",
                color: entry.role === "ai" ? "#fff" : "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: "bold",
                fontSize: "14px"
              }}>
                {entry.role === "ai" ? "AI" : "You"}
              </div>
              <div style={{
                flex: 1,
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}>
                {entry.message}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{
            display: "flex",
            gap: "16px",
            padding: "16px",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
            backgroundColor: "#444654",
            borderRadius: "8px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#10a37f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              AI
            </div>
            <div style={{
              width: "40px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#ececf1",
                animation: "bounce 1.4s infinite ease-in-out"
              }}></div>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#ececf1",
                animation: "bounce 1.4s infinite ease-in-out",
                animationDelay: "0.2s"
              }}></div>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#ececf1",
                animation: "bounce 1.4s infinite ease-in-out",
                animationDelay: "0.4s"
              }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "20px",
        borderTop: "1px solid #4d4d4f",
        backgroundColor: "#40414f"
      }}>
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          maxWidth: "800px",
          margin: "0 auto",
          gap: "12px"
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message AI Assistant..."
            required
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#40414f",
              color: "#ececf1",
              fontSize: "16px",
              outline: "none",
              boxShadow: "0 0 0 1px #4d4d4f",
              transition: "box-shadow 0.2s",
              ":focus": {
                boxShadow: "0 0 0 1px #ececf1"
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#10a37f",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
              ":hover": {
                backgroundColor: "#0d8a6d"
              },
              ":disabled": {
                backgroundColor: "#6e6e80",
                cursor: "not-allowed"
              }
            }}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
        <p style={{
          fontSize: "12px",
          color: "#8e8ea0",
          textAlign: "center",
          marginTop: "12px"
        }}>
          AI may produce inaccurate information. Consider verifying important facts.
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        body {
          margin: 0;
          padding: 0;
          background-color: #343541;
        }
      `}</style>
    </div>
  );
}