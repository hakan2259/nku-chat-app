import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import ModalImage from "react-modal-image";
import ReactPlayer from "react-player";
import "./Message.css";

const Message = ({ message, user1, decryptMessage }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message]);
  return (
    <div
      className={`message-wrapper ${message?.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={message?.from === user1 ? "me" : "friend"}>
        {message?.media ? (
          <ModalImage
            className="modal-image"
            small={decryptMessage(message?.media)}
            medium={decryptMessage(message?.media)}
            large={decryptMessage(message?.media)}
            showRotate="true"
            alt={decryptMessage(message?.text)}
          />
        ) : null}
       

        {message?.video ? (
          <ReactPlayer url={decryptMessage(message?.video)} 
          width="400px" 
          height="250px" 
          controls />
        ) : null}
        {decryptMessage(message?.text)}
        <br />
        <small>
          <Moment fromNow>{message?.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export default Message;
