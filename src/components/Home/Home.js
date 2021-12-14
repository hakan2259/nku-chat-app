import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import User from "../User/User.js";
import { makeStyles } from "@material-ui/core/styles";

import "./Home.css";

import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: "#dd6b20",
  },
}));

function Home() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const selectUser = (user) => {
    setChat(user);
    console.log(user);
  };

  return (
    <div className="home-container">
      <div className="users-container">
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className="messages-container">
        {chat ? (
          <div className="messages-user">
            {chat?.avatar ? (
              <Avatar
                alt={chat?.name}
                src={chat.avatar}
                className={classes.large}
              />
            ) : (
              <Avatar className={classes.large}>{chat?.name.substring(0, 1)}</Avatar>
            )}

            <h3>{chat?.name}</h3>
          </div>
        ) : (
          <h3 className="no-conversation">
            Select a user to start conversation
          </h3>
        )}
      </div>
    </div>
  );
}

export default Home;
