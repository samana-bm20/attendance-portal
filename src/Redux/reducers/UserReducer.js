import moment from "moment";

const getUser = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (user) {
    // const { expiresOn, loginDate } = user;
    // const now = moment().format("HH:mm:ss");
    // const todayDate = moment().format("DD/MM/YY");

    // let isExpired = false;

    // if (todayDate === loginDate && expiresOn <= now) isExpired = true;
    // else if (todayDate > loginDate) isExpired = true;
    // else if (todayDate < loginDate) isExpired = false;

    // if (isExpired) return null;

    return user;
  }

  return null;
};

const InitialState = {
  user: getUser(),
};

const UserReducer = (state = InitialState, action) => {

  if (action.type === "Save_User") {
    const newState = {
      user: action.payload[0],
    };

    localStorage.setItem("user", JSON.stringify(action.payload[0]));

    return newState;
  }

  //Update
  else if (action.type === "Update_User") {
    const newState = {
      user: { ...state.user, ...action.payload[0] },
    };

    localStorage.setItem("user", JSON.stringify(newState.user));

    return newState;
  }

  //logout
  else if (action.type === "Remove_User") {
    const newState = {
      user: null,
    };

    localStorage.removeItem("user");
    window.location.href = "/";

    return newState;
  }

  return state;
};

export default UserReducer;
