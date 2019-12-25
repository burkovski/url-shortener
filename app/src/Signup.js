import React, { createRef } from "react";
import { connect } from "react-redux";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { createUser } from "./actions/userActions/createAction";
import {AdapterLink} from "./utils";


const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
}));


const Signup = ({ onSignupClick, error }) => {
  const loginRef = createRef();
  const passwordRef = createRef();
  const rePasswordRef = createRef();
  const classes = useStyles();


  const handleLoginClick = () => {
    const email = loginRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const rePassword = rePasswordRef.current.value.trim();
    if (email && password && rePassword) {
      onSignupClick(email, password, rePassword);
    }
  };

  if (error) {
    alert(error);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              inputRef={loginRef}
              autoComplete="login"
              name="login"
              variant="outlined"
              required
              fullWidth
              id="login"
              label="Email"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={passwordRef}
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={rePasswordRef}
              variant="outlined"
              required
              fullWidth
              name="rePassword"
              label="Retype password"
              type="password"
              id="rePassword"
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
        <Button
          onClick={handleLoginClick}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link component={AdapterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};


const mapStateToProps = (state) => {
  return {
    error:  state.userReducer.error
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onSignupClick: (email, password, rePassword) => {
      console.log("map", email);
      dispatch(createUser(email, password, rePassword));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
