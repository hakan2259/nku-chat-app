import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../../firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import User from "../User/User.js";
import { makeStyles } from "@material-ui/core/styles";

import "./Home.css";

import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MessageForm from "../MessageForm/MessageForm.js";
import Message from "../Message/Message.js";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: "#dd6b20",
  },
}));

function Home() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [messages, setMessages] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const selectUser = async (user) => {
    setChat(user);
    console.log(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const messagesRef = collection(db, "messages", id, "chat");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });

    const docSnap = await getDoc(doc(db, "lastMessage", id));
    if (docSnap.data() && docSnap.data()?.from !== user1) {
      await updateDoc(doc(db, "lastMessage", id), {
        unread: false,
      });
    }
  };
  console.log(messages);

  const handleSubmit = async (e) => {
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    let videoUrl;

    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    if (video) {
      const videoRef = ref(
        storage,
        `videos/${new Date().getTime()} - ${video.name}`
      );
      const snap = await uploadBytes(videoRef, video);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      videoUrl = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      video: videoUrl || "",
    });
    setImg("");

    await setDoc(doc(db, "lastMessage", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      video: videoUrl || "",
      unread: true,
    });
    setText("");
  };

  return (
    <div className="home-container">
      <div className="users-container">
        <div className="users-title">
          <ExpandMoreIcon />
          Messages
        </div>
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages-container">
        {chat ? (
          <>
            <div className="messages-user">
              {chat?.avatar ? (
                <Avatar
                  alt={chat?.name}
                  src={chat.avatar}
                  className={classes.large}
                />
              ) : (
                <Avatar className={classes.large}>
                  {chat?.name.substring(0, 1).toUpperCase()}
                </Avatar>
              )}

              <h3>{chat?.name}</h3>
            </div>
            <div className="messages">
              {messages.length
                ? messages.map((message, i) => (
                    <Message key={i} message={message} user1={user1} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
              setVideo={setVideo}
            />
          </>
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
