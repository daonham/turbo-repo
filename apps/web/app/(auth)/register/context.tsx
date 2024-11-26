'use client';

import React, { createContext, useContext, useState } from 'react';

interface RegisterContextType {
  username: string;
  email: string;
  password: string;
  step: 'signup' | 'verify';
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setStep: (step: 'signup' | 'verify') => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'signup' | 'verify'>('signup');

  return (
    <RegisterContext.Provider
      value={{
        username,
        email,
        password,
        step,
        setUsername,
        setEmail,
        setPassword,
        setStep
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);

  if (context === undefined) {
    throw new Error('useRegisterContext must be used within a RegisterProvider');
  }

  return context;
};
