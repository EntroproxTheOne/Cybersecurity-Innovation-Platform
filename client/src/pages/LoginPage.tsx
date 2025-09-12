import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiShield, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: var(--spacing-lg);
`;

const LoginCard = styled(motion.div)`
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  font-size: 1.5rem;
  color: white;
`;

const LogoText = styled.h1`
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const Title = styled.h2`
  color: var(--color-text);
  font-size: 1.75rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.875rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-background);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  
  &:hover {
    color: var(--color-text);
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.875rem;
`;

const Button = styled.button<{ loading?: boolean }>`
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  opacity: ${props => props.loading ? 0.7 : 1};
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-lg);
  
  a {
    color: var(--color-primary);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <LogoIcon>
            <FiShield />
          </LogoIcon>
          <LogoText>THINK AI 3.0</LogoText>
        </Logo>

        <Title>Welcome Back</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Email</Label>
            <InputContainer>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                hasError={!!errors.email}
              />
            </InputContainer>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputContainer>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                hasError={!!errors.password}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputContainer>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button type="submit" loading={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <LinkText>
          Don't have an account? <Link to="/register">Sign up</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
