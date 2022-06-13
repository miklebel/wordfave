import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

import { wordsReducer } from "./reducers";

// AsyncStorage.clear();

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["words", "categories"],
};

const rootReducer = combineReducers({
  wordsReducer: persistReducer(persistConfig, wordsReducer),
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
