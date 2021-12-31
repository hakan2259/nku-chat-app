import React from "react";
import Photo from "../svg/Photo";
import Video from '../svg/Video';
import "./MessageForm.css";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import InputEmoji from "react-input-emoji";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const MessageForm = ({ handleSubmit, text, setText, setImg, setVideo }) => {
  const classes = useStyles();
  return (
    <form className="message-form">
      <label htmlFor="img">
        <Photo />
      </label>
      <input
        onChange={(e) => setImg(e.target.files[0])}
        type="file"
        id="img"
        accept="image/*"
        style={{ display: "none" }}
      />

      <label htmlFor="video">
        <Video />
      </label>
      <input
        onChange={(e) => setVideo(e.target.files[0])}
        type="file"
        id="video"
        accept="video/*"
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
      <IconButton aria-label="delete" onClick={handleSubmit}>
        <SendIcon />
      </IconButton>
    </form>
  );
};

export default MessageForm;
