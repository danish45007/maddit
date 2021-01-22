import axios from "axios";
import { useReducer } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { User } from "../types";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: string;
  payload?: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };

    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };

    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };

    default:
      throw new Error(`Undefined action type ${type}`);
  }
};

// Auth context provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    authenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/auth/authMe");
        dispatch({ type: "LOGIN", payload: res.data });
      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "STOP_LOADING" });
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);

export const useAuthDispatch = () => useContext(DispatchContext);
