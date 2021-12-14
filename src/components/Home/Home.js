import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import User from "../User/User.js";
import './Home.css';


function Home() {
  const [users, setUsers] = useState([]);
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
  console.log(users);
  return (
    <div className="home-container">
      <div className="users-container">
        {users.map((user) => (
          <User key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Home;
