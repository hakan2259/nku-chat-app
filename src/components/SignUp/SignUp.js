import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import BarWave from "react-cssfx-loading/lib/BarWave";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 800,
    margin: "auto",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  signUpButton: {
    marginBottom: 10,
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: 14,
  },
});

function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!name || !email || !password) {
      setError("All fields are required!");
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      setName("");
      setEmail("");
      setPassword("");
      setError(null);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        <h2 className={classes.title} id="title">
          Sign up for free
        </h2>
        <div id="description" className={classes.description}>
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="filled-start-adornment"
            fullWidth
            style={{ marginTop: 20 }}
            className={clsx(classes.margin, classes.textField)}
            variant="filled"
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="filled-start-adornment"
            fullWidth
            style={{ marginTop: 20 }}
            className={clsx(classes.margin, classes.textField)}
            variant="filled"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="filled-start-adornment"
            fullWidth
            style={{ marginTop: 20 }}
            className={clsx(classes.margin, classes.textField)}
            variant="filled"
          />
        </div>
        {error ? <p className={classes.error}>{error}</p> : null}
      </CardContent>
      <CardActions>
        <Button
          className={classes.signUpButton}
          onClick={signUp}
          variant="outlined"
          type="submit"
        >
          {loading ? <BarWave color="#055FFB" duration="1s" /> : "Sign Up"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default SignUp;
