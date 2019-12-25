import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import ToolBar from "@material-ui/core/Toolbar/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";

import { AdapterLink } from "./utils";


const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

const UserNavBar = ({ email, logoutHandler, classes }) => {
  return (
    <React.Fragment>
      <Button color="inherit" href="#" className={classes.link} component={AdapterLink} to='/cabinet'>
        {email}
      </Button>
      <Button variant="outlined" color="inherit" href="#" className={classes.link} onClick={logoutHandler} >
        Logout
      </Button>
    </React.Fragment>
  );
};


const GuestNavBar = ({ classes }) => {
  return (
    <React.Fragment>
      <Button color="inherit" href="#" className={classes.link} component={AdapterLink} to='/signup'>
        Sign up
      </Button>
      <Button variant="outlined" color="inherit" href="#" className={classes.link} component={AdapterLink} to='/login'>
        Login
      </Button>
    </React.Fragment>
  );
};


const NavBar = ({ email, logoutHandler }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
       <AppBar position="static" color="primary" elevation={0} className={classes.appBar}>
        <ToolBar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Url Shortener
          </Typography>
          <nav>
            <Link variant="button" color="inherit" href="#" className={classes.link} component={AdapterLink} to='/'>
              Home
            </Link>
            {
              email ?
              <UserNavBar email={email} logoutHandler={logoutHandler} classes={classes} /> :
              <GuestNavBar classes={classes} />
            }
          </nav>
        </ToolBar>
      </AppBar>
    </React.Fragment>
  );
};


export {
  NavBar
};
