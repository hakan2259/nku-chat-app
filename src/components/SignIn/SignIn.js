import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import BouncingBalls from "react-cssfx-loading/lib/BouncingBalls";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { doc, updateDoc } from "firebase/firestore";
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

function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!email || !password) {
      setError("All fields are required!");
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
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
          Login to your account
        </h2>
        <div id="description" className={classes.description}>
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
          onClick={signIn}
          variant="outlined"
          type="submit"
        >
          {loading ? (
            <BouncingBalls
              color="#E45914"
              duration="0.7s"
            />
          ) : (
            "Sign In"
          )}
        </Button>
      </CardActions>
    </Card>
  );
}

export default SignIn;
