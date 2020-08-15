import React, { useState, useContext } from "react";

import {
  Grid,
  Snackbar,
  Button,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { GlobalContext } from "../context/GlobalState";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

export default function Home(props) {
  const { user } = useContext(GlobalContext);
  const classes = useStyles();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });
  const perms = props.perms;

  function onClick(e) {
    if (user !== null) {
      if (user.role === "Admin") {
        setSnack({ open: true, message: "Access Green Button" });
      }
    }
  }
  function onClick2(e) {
    if (user !== null) {
      if (user.role === "Admin") {
        setSnack({ open: true, message: "Access Red Button" });
      }
    }
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid className={classes.paper} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="textPrimary">
              {perms.length === 0
                ? "Feels Empty!"
                : perms.includes("loading")
                ? "Loading..."
                : null}
            </Typography>

            {perms.includes("AccessGreenButton") ? (
              <Button
                variant="outlined"
                style={{ color: "green" }}
                className={classes.margin}
                onClick={onClick}
              >
                Access Green Button
              </Button>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            {perms.includes("AccessRedButton") ? (
              <Button
                variant="outlined"
                style={{ color: "red" }}
                className={classes.margin}
                onClick={onClick2}
              >
                Access Red Button
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Snackbar
          open={snack.open}
          message={snack.message}
          autoHideDuration={5000}
          onClose={(e, r) => {
            if (r === "clickaway") return;
            setSnack({ open: false, message: "" });
          }}
        />
      </div>
    </React.Fragment>
  );
}
