import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import postsReducer from "./posts";
import designsReducer from "./designs";
import commentsReducer from "./comments";
import followsReducer from "./follows";
import likesReducer from "./likes";
import usersReducer from "./users";


const rootReducer = combineReducers({
  session: sessionReducer,
  users: usersReducer,
  designs: designsReducer,
  posts: postsReducer,
  comments: commentsReducer,
  follows: followsReducer,
  likes: likesReducer


});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
