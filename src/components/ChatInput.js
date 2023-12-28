import React, { useState } from "react";

function ChatInput({ sendChatMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendChatMessage(text);
    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <form className="input-wrapper" onSubmit={handleSubmit}>
      <input value={text} placeholder="Type here..." onChange={handleChange} />
      <button type="submit">Send message</button>
    </form>
  );
}

export default ChatInput;
