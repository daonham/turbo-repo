'use client';

import React, { createContext, use, useState } from 'react';

interface RegisterContextType {
  name: string;
  email: string;
  password: string;
  step: 'signup' | 'verify';
  setName: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setStep: (step: 'signup' | 'verify') => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'signup' | 'verify'>('signup');

  return (
    <RegisterContext
      value={{
        name,
        email,
        password,
        step,
        setName,
        setEmail,
        setPassword,
        setStep
      }}
    >
      {children}
    </RegisterContext>
  );
};

export const useRegisterContext = () => {
  const context = use(RegisterContext);

  if (context === undefined) {
    throw new Error('useRegisterContext must be used within a RegisterProvider');
  }

  return context;
};
