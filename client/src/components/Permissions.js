import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { GlobalContext } from "../context/GlobalState";
import {
  Snackbar,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableHead,
  TablePagination,
} from "@material-ui/core";

function Auth(props) {
  if (props.user && props.user.role !== "Admin") {
    return <Redirect to="/dashboard" />;
  }
  return null;
}

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

export default function Permissions() {
  const { user, token } = useContext(GlobalContext);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
  });
  const [customers, setCustomers] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function getCustomers() {
    axios({
      method: "GET",
      url: "/api/users/all",
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => {
        setCustomers(res.data.users);
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
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(customers);
  return (
    <React.Fragment>
      <Auth user={user} />
      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
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
