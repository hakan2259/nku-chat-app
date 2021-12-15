import React from "react";
import Attachment from "../svg/Attachment";
import "./MessageForm.css";

import Button from "@material-ui/core/Button";

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className="message-form" onSubmit={handleSubmit}>
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
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="message-form-btn">Send</button>
      </div>
    </form>
  );
};

export default MessageForm;
