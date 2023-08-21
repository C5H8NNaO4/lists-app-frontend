import React, { createContext, Dispatch, useReducer } from 'react';

type State = {
  menuOpen: boolean;
  animatedBackground: boolean;
  messages: string[];
  history: HistoryAction[];
  fullscreen: boolean;
  search: string;
  searchDistance: number;
};

type HistoryAction = {
  action: string;
  value: any;
  reverse: () => void;
};

const initialState: State = {
  menuOpen: false,
  animatedBackground: localStorage.getItem('animatedBackgroundUser')
    ? localStorage.getItem('animatedBackgroundUser') === 'true'
    : localStorage.getItem('animatedBackground') === 'true',
  messages: [],
  history: [],
  fullscreen: localStorage.getItem('fullscreen') === 'true',
  search: '',
  searchDistance: Number(localStorage.getItem('searchDistance') || 2),
};

export enum Actions {
  TOGGLE_MENU,
  TOGGLE_ANIMATED_BACKGROUND,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  RECORD_CHANGE,
  REVERT_CHANGE,
  TOGGLE_FULLSCREEN,
  SEARCH,
  SET_SEARCH_DISTANCE,
}

export const stateContext = createContext({
  state: initialState,
  dispatch: (() => {}) as Dispatch<any>,
});

export type Action = { type: Actions; value: any };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case Actions.TOGGLE_MENU:
      return {
        ...state,
        menuOpen: !state.menuOpen,
      };
    case Actions.TOGGLE_ANIMATED_BACKGROUND:
      return {
        ...state,
        animatedBackground: !state.animatedBackground,
      };
    case Actions.SHOW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.value],
      };
    case Actions.HIDE_MESSAGE:
      return {
        ...state,
        messages: state.messages.slice(1),
      };
    case Actions.RECORD_CHANGE:
      return {
        ...state,
        history: [...state.history, action.value],
      };
    case Actions.REVERT_CHANGE: {
      return {
        ...state,
        history: state.history.slice(0, -1),
      };
    }
    case Actions.TOGGLE_FULLSCREEN:
      return {
        ...state,
        fullscreen: !state.fullscreen,
      };

    case Actions.SEARCH:
      return {
        ...state,
        search: action.value,
      };
    case Actions.SET_SEARCH_DISTANCE:
      return {
        ...state,
        searchDistance: action.value,
      };
    default:
      return state;
  }
  return state;
};

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <stateContext.Provider value={{ state, dispatch }}>
      {children}
    </stateContext.Provider>
  );
};
