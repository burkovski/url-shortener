import React, { createRef } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Link from "@material-ui/core/Link";
import ArchiveOutlined from "@material-ui/icons/ArchiveOutlined";

import SaveIcon from "@material-ui/icons/Save";
import CopyIcon from "@material-ui/icons/FileCopy"
import TextField from "@material-ui/core/TextField";

import { shortifyUrl } from "./actions/urlActions/shortifyAction";
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
    margin: theme.spacing(3, 0, 2),
  },
}));


const Home = ({ onShortifyClick, shortUrl, error }) => {
  const classes = useStyles();
  let urlInputRef = createRef();
  let shortUrlRef = createRef();
  const [value, setValue] = React.useState(90);

  const handleShortifyClick = () => {
    const url = urlInputRef.current.value.trim();
    if (url) {
      onShortifyClick(url, value);
    }
  };

  const handleCopyClick = () => {
    const shortUrl = shortUrlRef.current;
    shortUrl.select();
    document.execCommand("copy");
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = event => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  // if (error) {
  //   alert(error);
  // }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ArchiveOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Shortify
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={11}>
            <TextField
              inputRef={urlInputRef}
              name="longUrl"
              variant="outlined"
              required
              fullWidth
              id="longUrl"
              label="Long URL"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Fab
              onClick={handleShortifyClick}
              color="primary"
            >
              <SaveIcon />
            </Fab>
          </Grid>

          <Typography id="input-slider" gutterBottom>
            Time to life in days
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs>
              <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                step={1}
                min={1}
                max={365}
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 1,
                  max: 365,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={11}>
            <TextField
              inputRef={shortUrlRef}
              name="shortUrl"
              variant="outlined"
              fullWidth
              id="shortUrl"
              label="There will be your short URL"
              value={shortUrl || ""}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Fab
              onClick={handleCopyClick}
              color="primary"
            >
              <CopyIcon />
            </Fab>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <Link component={AdapterLink} to="/login" variant="body2">
              SignIn
            </Link>
            {" to save the URL in your account and view their statistics. " +
            "Without logging in, the shortened and not copied URLs will be lost."}
          </Grid>
        </Grid>
        {error ? (
          <Typography component="h1" variant="h5">
            {error}
          </Typography>
        ) : null}
      </div>
    </Container>
  )
};


const mapStateToProps = (state) => {
  const { accessToken, refreshToken } = state.userReducer;
  const { shortUrl } = state.urlReducer;
  return { accessToken, refreshToken, shortUrl, error: state.urlReducer.error };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onShortifyClick: (url, ttlDays) => {
      dispatch(shortifyUrl(url, ttlDays));
    }
  };
};


export  default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

