import React from "react";
import Img from '../../avatar.png'
import './User.css';
const User = ({ user }) => {
  return (
    <div className="user-wrapper">
      <div className="user-info">
          <div className="user-detail">
                <img src={user.avatar || Img} alt="avatar" className="avatar"/>
                <h4>{user.name}</h4>
          </div>
          <div className={`user-status ${user.isOnline? 'online' : 'offline'}`}>

          </div>
      </div>
    </div>
  );
};

export default User;
