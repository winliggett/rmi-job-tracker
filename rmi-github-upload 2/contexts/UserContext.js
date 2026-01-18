import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);

export const ROLES = {
  ADMIN: 'admin',
  TRADE_PAINTER: 'trade-painter',
  TRADE_PLUMBER: 'trade-plumber',
  TRADE_ELECTRICIAN: 'trade-electrician',
  TRADE_HVAC: 'trade-hvac',
  TRADE_FLOORING: 'trade-flooring',
  TRADE_CABINETS: 'trade-cabinets',
};

export const TRADE_ROLES = [
  ROLES.TRADE_PAINTER,
  ROLES.TRADE_PLUMBER,
  ROLES.TRADE_ELECTRICIAN,
  ROLES.TRADE_HVAC,
  ROLES.TRADE_FLOORING,
  ROLES.TRADE_CABINETS,
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockRole, setMockRole] = useState(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      const storedMockRole = await AsyncStorage.getItem('mockRole');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedMockRole) {
        setMockRole(storedMockRole);
      }
    } catch (error) {
      console.error('Failed to load stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setMockRole(null);
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('mockRole');
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  };

  const setTestRole = async (role) => {
    setMockRole(role);
    try {
      if (role) {
        await AsyncStorage.setItem('mockRole', role);
      } else {
        await AsyncStorage.removeItem('mockRole');
      }
    } catch (error) {
      console.error('Failed to store mock role:', error);
    }
  };

  const getEffectiveRole = () => {
    if (mockRole) return mockRole;
    if (!user) return null;
    if (user.role === 'admin') return ROLES.ADMIN;
    if (user.tradeRole) return `trade-${user.tradeRole}`;
    return user.role || ROLES.ADMIN;
  };

  const isAdmin = () => getEffectiveRole() === ROLES.ADMIN;

  const isTrade = () => {
    const role = getEffectiveRole();
    return role && role.startsWith('trade-');
  };

  const getTradeKey = () => {
    const role = getEffectiveRole();
    if (role && role.startsWith('trade-')) {
      return role.replace('trade-', '');
    }
    return null;
  };

  const hasRole = (allowedRoles) => {
    const role = getEffectiveRole();
    if (!role) return false;
    
    return allowedRoles.some(allowed => {
      if (allowed === role) return true;
      if (allowed === 'trade-*' && role.startsWith('trade-')) return true;
      return false;
    });
  };

  const value = {
    user,
    token,
    isLoading,
    mockRole,
    login,
    logout,
    setTestRole,
    getEffectiveRole,
    isAdmin,
    isTrade,
    getTradeKey,
    hasRole,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
