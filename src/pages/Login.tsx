import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/');
    }
    return success;
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}