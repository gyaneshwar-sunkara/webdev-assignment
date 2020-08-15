import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { GlobalContext } from "../context/GlobalState";
import {
  Snackbar,
  TableRow,
  TableCell,
  Collapse,
  Box,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Auth(props) {
  if (props.user && props.user.role !== "Admin") {
    return <Redirect to="/dashboard" />;
  }
  return null;
}

function Row(props) {
  const { row, token } = props;
  const [open, setOpen] = React.useState(false);
  const [permissions, setPermissions] = React.useState({ loading: true });
  const classes = useRowStyles();

  const handleChange = (event) => {
    updatePerms();
  };

  function getPerms() {
    axios({
      method: "GET",
      url: `/api/permissions/${row._id}`,
      headers: {
        "x-auth-token": token,
      },
    }).then((res) => {
      setPermissions(res.data.perms);
    });
  }

  function updatePerms() {
    axios({
      method: "PATCH",
      url: `/api/permissions/${row._id}`,
      headers: {
        "x-auth-token": token,
      },
      data: { AccessGreenButton: !permissions.AccessGreenButton },
    }).then((res) => {
      setPermissions(res.data.perms);
    });
  }

  function onCollapseClick() {
    getPerms();
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {row._id}
        </TableCell>
        <TableCell align="right">{row.email}</TableCell>
        <TableCell align="right">{row.role}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              onCollapseClick();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell align="right">Joining Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.date}>
                    <TableCell component="th" scope="row">
                      {row.firstname}
                    </TableCell>
                    <TableCell>{row.lastname}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Permissions
              </Typography>
              {permissions.loading ? (
                <Typography variant="caption" gutterBottom component="div">
                  Loading...
                </Typography>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.AccessGreenButton}
                      onChange={handleChange}
                      name="AccessGreenButton"
                      color="primary"
                    />
                  }
                  label="Access Green Button"
                  labelPlacement="start"
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Permissions(props) {
  const customers = props.customers;
  const { user, token } = useContext(GlobalContext);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <React.Fragment>
      <Auth user={user} />
      <Typography variant="h6" align="center" color="textPrimary">
        {customers.length === 0
          ? "Feels Empty!"
          : customers.includes("loading")
          ? "Loading..."
          : null}
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => {
                return <Row key={customer._id} row={customer} token={token} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 5, 10, 15]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Snackbar
        open={snack.open}
        message={snack.message}
        autoHideDuration={3000}
        onClose={(e, r) => {
          if (r === "clickaway") return;
          setSnack({ open: false, message: "" });
        }}
      />
    </React.Fragment>
  );
}
