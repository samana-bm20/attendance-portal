import { legacy_createStore as createStore } from 'redux'
import moment from "moment";
const getUser = () => {
    const user = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null;
  
    if (user) {
      const { expiresOn, loginDate } = user;
      const now = moment().format("HH:mm:ss");
      const todayDate = moment().format("DD/MM/YY");
      let isExpired = false;
      if (todayDate === loginDate && expiresOn <= now) isExpired = true;
      else if (todayDate > loginDate) isExpired = true;
      else if (todayDate < loginDate) isExpired = false;
  
      if (isExpired) return null;
  
      return user;
    }
  
    return null;
  };
  
  
  const initialState = {
    user: getUser(),
    sidebarShow: true,
    theme: 'light',
    sidebarUnfoldable:true
  };
   

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case "Save_User":
            const saveUserState = {
                user: rest.payload[0],
            };
            sessionStorage.setItem("user", JSON.stringify(rest.payload[0]));
            return saveUserState;

        case "Update_User":
            const updateUserState = {
                user: { ...state.user, ...rest.payload[0] },
            };
            sessionStorage.setItem("user", JSON.stringify(updateUserState.user));
            return updateUserState;

        case "Remove_User":
            const removeUserState = {
                user: null,
            };
            sessionStorage.removeItem("user");
            window.location.href = "/";
            return removeUserState;

        case "set":
            return { ...state, ...rest };

        default:
            return state;
    }
}

const store = createStore(changeState)
export default store
