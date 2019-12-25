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

import { loginUser } from "./actions/userActions/loginAction";
import { AdapterLink } from "./utils";


const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function SignIn({onLoginClick, error}) {
  const loginRef = createRef();
  const passwordRef = createRef();
  const classes = useStyles();

  const handleLoginClick = () => {
    const login = loginRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    if (login && password) {
      onLoginClick(login, password);
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
          Sign in
        </Typography>
          <TextField
            inputRef={loginRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login"
            label="Email"
            type="text"
            name="login"
            autoComplete="login"
            autoFocus
          />
          <TextField
            inputRef={passwordRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            onClick={handleLoginClick}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={AdapterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
      </div>
    </Container>
  );
}


const mapStateToProps = (state) => {
  return {
    error: state.userReducer.error
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: (login, password) => {
      dispatch(loginUser(login, password));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
