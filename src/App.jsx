import { useEffect, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./components/companyinfo";
import Logo from './logo.jpg';

const App = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo
  }]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory =(text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text, isError}]);
    }

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").
      trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup"> 
        <div className="chat-header">
          <div className="header-info">
             <img className="bells-logo" src={Logo} alt="Bells University of Technology" />
            <h2 className="logo-text">Bells University Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)}  className="material-symbols-outlined">arrow_drop_down</button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <img className="bells-logo-alt" src={Logo} alt="Bells University of Technology" />

            <p className="message-text">
              Hello <br /> How can i help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
