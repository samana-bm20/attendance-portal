import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import DataReducer from "./DataReducer"; 

const rootReducer = combineReducers({
  UserReducer,
  DataReducer
});

export default rootReducer;
