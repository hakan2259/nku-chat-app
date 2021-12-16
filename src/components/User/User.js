import React, { useEffect, useState } from "react";
import Img from "../../avatar.png";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase.js";

import "./User.css";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
const User = ({ user, selectUser, user1, chat }) => {
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
  console.log(data);
  return (
    <div
      className={`user-wrapper ${chat.name === user.name && "selected-user"}`}
      onClick={() => selectUser(user)}
    >
      <div className="user-info">
        <div className="user-detail">
          <Avatar
            alt={user?.name}
            src={user?.avatar || Img}
            className={classes.large}
          />
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
          {data.text}
        </p>
      )}
    </div>
  );
};

export default User;
