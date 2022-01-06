import React, { useEffect, useState, useRef } from "react";
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
import { Link } from "react-router-dom";

import "./Home.css";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DuoIcon from "@material-ui/icons/Duo";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MessageForm from "../MessageForm/MessageForm.js";
import Message from "../Message/Message.js";

import Peer from "peerjs";
import VideoCall from "../VideoCall/VideoCall.js";
import { useNavigate } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import CryptoJS from "crypto-js";

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
  const [videoCallDisabled, setVideoCallDisabled] = useState(false);

  const user1 = auth.currentUser.uid;

  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  let navigate = useNavigate();
  var currentCall;

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

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      const updateUser = async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          peerId: id,
        });
      };
      updateUser();
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
    setVideoCallDisabled(true);
  };

  const videoDisabled = () => {
    setVideoCallDisabled(false);
  };
  const selectUser = async (user) => {
    setChat(user);

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

  // Encrypt
  const encryptMessage = (text) => {
    return CryptoJS.AES.encrypt(text, "Secret Passphrase").toString();
  };

  //Decrypt
  const decryptMessage = (text) => {
    var bytes = CryptoJS.AES.decrypt(text, "Secret Passphrase");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

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
      url = encryptMessage(dlUrl);
    }

    if (video) {
      const videoRef = ref(
        storage,
        `videos/${new Date().getTime()} - ${video.name}`
      );
      const snap = await uploadBytes(videoRef, video);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      videoUrl = encryptMessage(dlUrl);
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text: encryptMessage(text),
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      video: videoUrl || "",
    });
    setImg("");
    setVideo("");

    await setDoc(doc(db, "lastMessage", id), {
      text: encryptMessage(text),
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
            decryptMessage = {decryptMessage}
          />
        ))}
      </div>
      <div className="video-grid">
        <Grid container>
          <Grid item xs={5}>
            <video ref={currentUserVideoRef} />
          </Grid>
          <Grid item xs>
            <video ref={remoteVideoRef} />
          </Grid>
        </Grid>
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

              <IconButton
                onClick={() => call(chat?.peerId)}
                aria-label="video-call"
                style={{ color: "#115293", zIndex: 3 }}
              >
                <DuoIcon style={{ fontSize: 35 }} />
              </IconButton>
            </div>

            <div className="messages">
              {messages.length
                ? messages.map((message, i) => (
                    <Message key={i} message={message} decryptMessage={decryptMessage} user1={user1} />
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
