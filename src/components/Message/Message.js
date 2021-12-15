import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import ModalImage from "react-modal-image";
import "./Message.css";

const Message = ({ message, user1 }) => {
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
            small={message?.media}
            medium={message?.media}
            large={message?.media}
            showRotate="true"
            alt={message?.text}
          />
        ) : null}
        {message?.media ? <br /> : ""}
        {message?.text}
        <br />
        <small>
          <Moment fromNow>{message?.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export default Message;
