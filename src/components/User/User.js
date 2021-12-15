import React from "react";
import Img from "../../avatar.png";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

import "./User.css";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
const User = ({ user, selectUser }) => {
  const classes = useStyles();
  return (
    
    <div className="user-wrapper" onClick={() => selectUser(user)}>
      
      <div className="user-info">
        <div className="user-detail">
          <Avatar
            alt={user?.name}
            src={user?.avatar || Img}
            className={classes.large}
          />
          <h4>{user?.name}</h4>
        </div>
        <div
          className={`user-status ${user?.isOnline ? "online" : "offline"}`}
        ></div>
      </div>
    </div>
  );
};

export default User;
