export default (state, action) => {
  switch (action.type) {
    case "SignIn":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "SignOut":
      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};
