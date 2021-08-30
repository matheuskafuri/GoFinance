import React, { 
  createContext, 
  ReactNode,
  useContext
} from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
} 

interface AuthContextData {
  user: User;
}


export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps ) {
  const user = {
    id: '1212121212',
    name: 'Matheus Kafuri',
    email: 'matheus10.rk@gmail.com',
  };

  return (
    <AuthContext.Provider value={{ user }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }