import React, { createContext, useReducer } from "react";
import jwt_decode from "jwt-decode";
import AppReducer from "./AppReducer";

// Getter & Setter(s)
function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
  return JSON.parse(
    localStorage.getItem("user") !== "undefined"
      ? localStorage.getItem("user")
      : null
  );
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token") !== "undefined"
    ? localStorage.getItem("token")
    : null;
}

// Initial state
const initialState = {
  user: getUser(),
  token: getToken(),
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function isSignedIn() {
    const token = getToken();
    try {
      const decoded = jwt_decode(token);
      if (Date.now() >= decoded.exp * 1000) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function signIn(data) {
    setUser(data.user);
    setToken(data.token);
    dispatch({
      type: "SignIn",
      payload: {
        user: data.user,
        token: data.token,
      },
    });
  }

  function signOut() {
    localStorage.clear();
    dispatch({
      type: "SignOut",
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
