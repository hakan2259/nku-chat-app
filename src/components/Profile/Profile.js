import React, { useState, useEffect } from "react";
import Img from "../../avatar.png";
import "./Profile.css";
import Paper from "@material-ui/core/Paper";
import Camera from "../svg/Camera.js";
import { storage, db, auth } from "../../firebase.js";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Delete from "../svg/Delete";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const navigate = useNavigate();

  

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return user ? (
    <Paper
      elevation={3}
      style={{
        minWidth: 275,
        maxWidth: 500,
        margin: "auto",
        marginTop: 20,
        padding: 20,
      }}
    >
      <div className="profile-container">
        <div className="img-container">
          <img src={user?.avatar || Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user?.avatar ? <Delete deleteImage={deleteImage} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text-container">
          {user?.peerId}
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <hr />
          <small>
            Joined on: {new Date(user?.createdAt.toDate()).toDateString()}
          </small>
        </div>
      </div>
    </Paper>
  ) : null;
};

export default Profile;
