import React from "react";
import Attachment from "../svg/Attachment";
import "./MessageForm.css";

import InputEmoji from "react-input-emoji";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className="message-form">
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <InputEmoji
          value={text}
          onChange={setText}
          onEnter={handleSubmit}
          cleanOnEnter
          placeholder="Type a message"
        />
      </div>
    </form>
  );
};

export default MessageForm;
