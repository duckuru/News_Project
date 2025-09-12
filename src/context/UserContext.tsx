import { useReducer, createContext, type ReactNode } from "react";

export const UserContext = createContext<{
    state: { user: any };
    dispatch: React.Dispatch<{ type: "SET_USER"; payload: any } | { type: 'LOGOUT_USER' }>;
}>({
    state: { user: null },
    dispatch: () => { },
});

export const userReducer = (_state: { user: any }, action: { type: "SET_USER"; payload: any } | { type: 'LOGOUT_USER' }) => {
    switch (action.type) {
        case 'SET_USER':
            return { user: action.payload };
        case 'LOGOUT_USER':
            return { user: null };
    }
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, { user: null });

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
}