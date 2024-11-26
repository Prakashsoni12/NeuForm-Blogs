import { createContext, useState, useContext } from 'react';

// Create UserContext
const UserContext = createContext();

// UserProvider to manage global user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);
