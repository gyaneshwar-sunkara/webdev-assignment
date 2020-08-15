import React, { useState } from "react";

import { Grid, Snackbar, Button, makeStyles } from "@material-ui/core";

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
  const classes = useStyles();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid className={classes.paper} container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              style={{ color: "green" }}
              className={classes.margin}
            >
              Access Green Button
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              style={{ color: "red" }}
              className={classes.margin}
            >
              Access Red Button
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={snack.open}
          message={snack.message}
          autoHideDuration={3000}
          onClose={(e, r) => {
            if (r === "clickaway") return;
            setSnack({ open: false, message: "" });
          }}
        />
      </div>
    </React.Fragment>
  );
}
