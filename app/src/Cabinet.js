import React from "react";
import { connect } from "react-redux";

import { fetchUrls } from "./actions/urlActions/fetchAction";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  }
}));


const UrlInfo = ({ classes, urlInfo }) => {
  const { url_long, url_short, redirects } = urlInfo;

  return (
    <Container className={root} maxWidth="sm">
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
                {
                  `Long URL: ${
                    url_long.length > 50 ? (
                      url_long.slice(0, 24) + '...' + url_long.slice(-23)
                    ) : (
                      url_long
                    )
                  }`
                }
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
                {`Short URL: ${url_short}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
                {`Redirects: ${redirects}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};


const Cabinet = ({ urls, onLoad }) => {
  const classes = useStyles();
  onLoad();
  if (urls && !urls.length) {
    return <div>You haven't urls yet!</div>;
  }

  return (
    urls.map((url, index) => {
      return <UrlInfo id={index} classes={classes} urlInfo={url} />
    })
  );
};


const mapStateToProps = (state) => {
  return {
    urls: state.urlReducer.urls,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchUrls());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cabinet);
