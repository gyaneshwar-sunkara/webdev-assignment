import React, { useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Button, Paper, Tabs, Tab } from "@material-ui/core";
import { Snackbar } from "@material-ui/core";

import { GlobalContext } from "../context/GlobalState";

import Permissions from "./Permissions";
import Home from "./Home";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

function Auth(props) {
  if (props.auth) {
    return <Redirect to="/" />;
  }
  return null;
}

export default function Dashboard() {
  let match = useRouteMatch();
  let location = useLocation();
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [value2, setValue2] = React.useState(1);
  const [permissions, setPermissions] = React.useState([]);
  const { user, token, isSignedIn, signOut } = useContext(GlobalContext);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });

  function getPermissions() {
    axios({
      method: "GET",
      url: "/api/permissions",
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => {
        setPermissions(res.data.perms);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            setSnack({ open: true, message: err.response.data.msg });
          } else if (err.response.status === 500) {
            setSnack({
              open: true,
              message: "Can't seem to reach the server at the moment!",
            });
          } else {
            setSnack({ open: true, message: err.message });
          }
        } else {
          setSnack({ open: true, message: err.message });
        }
      });
  }

  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(permissions);

  return (
    <React.Fragment>
      <Auth auth={!isSignedIn()} />
      <Router>
        <div className={classes.root}>
          <Container
            component="main"
            justify="center"
            maxWidth="lg"
            className={classes.paper}
          >
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Paper square>
                  <Tabs
                    value={
                      location.pathname === "/dashboard/permissions"
                        ? value2
                        : value
                    }
                    onChange={(e, n) =>
                      location.pathname === "/dashboard/permissions"
                        ? setValue2(n)
                        : setValue(n)
                    }
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="Home" component={Link} to={`${match.url}`} />
                    {/* <PermissionsTab user={user} match={match} /> */}
                    {user && user.role === "Admin" ? (
                      <Tab
                        label="Give Permissions"
                        component={Link}
                        to={`${match.url}/permissions`}
                      />
                    ) : null}
                  </Tabs>
                </Paper>
                <Paper style={{ marginTop: "2rem" }}>
                  <Switch>
                    <Route exact path={`${match.path}/permissions`}>
                      <Permissions />
                    </Route>
                    <Route exact path={`${match.path}`}>
                      <Home />
                    </Route>
                  </Switch>
                  <Snackbar
                    open={snack.open}
                    message={snack.message}
                    autoHideDuration={3000}
                    onClose={(e, r) => {
                      if (r === "clickaway") return;
                      setSnack({ open: false, message: "" });
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="secondary" onClick={signOut}>
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Router>
    </React.Fragment>
  );
}