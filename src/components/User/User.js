import React, { useEffect, useState } from "react";
import Img from "../../avatar.png";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase.js";
import Photo from '../svg/Photo.js';

import "./User.css";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: "#01AEBC",
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    paddingTop: 10,
    backgroundColor: "#FF6347",
  },
}));
const User = ({ user, selectUser, user1, chat, decryptMessage }) => {
  const classes = useStyles();
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMessage", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);
 
  return (
    <>
      <div
        className={`user-wrapper ${chat.name === user.name && "selected-user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user-info">
          <div className="user-detail">
            {user?.avatar ? (
              <Avatar
                alt={chat?.name}
                src={chat.avatar}
                className={classes.large}
              />
            ) : (
              <Avatar className={classes.large}>
                {user?.name.substring(0, 1).toUpperCase()}
              </Avatar>
            )}

            <h4>{user?.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user-status ${user?.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {data?.media ? "Picture" : data?.video ? "Video" : decryptMessage(data?.text)}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm-container ${chat.name === user.name && "selected-user"}`}
      >
        <Avatar className={`${classes.small} sm-screen`}>
          {user?.name.substring(0, 1).toUpperCase()}
        </Avatar>
      </div>
    </>
  );
};

export default User;
