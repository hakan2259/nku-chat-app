import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase.js";
import { signOut } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../context/auth.js";
import { useNavigate } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import StatusOnline from "../svg/Online";
import "./Navbar.css";

function Navbar() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/sign-in");
  };
  return (
    <nav>
      <h3 className="navbar">
        <Link to="/">NKU ÇMF Chat App</Link>
       
      </h3>

      <div>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <IconButton
              aria-label="logout"
              style={{ color: "#fff" }}
              onClick={handleSignOut}
            >
              <MeetingRoomIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
