import Logo from "../logo.jpg";

const ChatMessage = ({chat}) => {
    return (
        !chat.hideInChat && (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>
            {chat.role === "model" && <img className="bells-logo-alt" src={Logo} alt="Bells University of Technology" />}
            <p className="message-text">{chat.text}</p>
          </div>
        )
    )
}

export default ChatMessage