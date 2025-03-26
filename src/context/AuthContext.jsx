import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing sessions
    const userSession = localStorage.getItem('userSession');
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession) {
      setUser(JSON.parse(adminSession));
    } else if (userSession) {
      setUser(JSON.parse(userSession));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};