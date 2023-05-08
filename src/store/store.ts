import { combineReducers } from "redux";
import type {} from 'redux-thunk/extend-redux' // https://github.com/reduxjs/redux-thunk/issues/333s
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";

import { botSlice } from "./slices/botSlice";
import { OMRSlice } from "./slices/OMRSlice";
import { questionSlice } from "./slices/questionSlice";
import { userSlice } from "./slices/userSlice";


const rootReducer = combineReducers({
  [botSlice.name]: botSlice.reducer,
  [OMRSlice.name]: OMRSlice.reducer,
  [questionSlice.name]: questionSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });


const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    // we need it only on client side
    const persistConfig = {
      key: "root",
      version: 1,
      storage,
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
      // devTools: process.env.NODE_ENV !== "production",
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });
    store.__persistor = persistStore(store); // Nasty hack
    return store;
  }
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);