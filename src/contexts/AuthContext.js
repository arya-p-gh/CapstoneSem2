import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const signup = async (email, password) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully:', userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully:', userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser, (error) => setError(error.message));
    setLoading(false);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      signup,
      login,
      logout,
      error
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 