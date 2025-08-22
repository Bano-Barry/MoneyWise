import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
  }) => {
    const success = await register(data.email, data.password, data.firstName, data.lastName);
    if (success) {
      navigate('/');
    }
    return success;
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}