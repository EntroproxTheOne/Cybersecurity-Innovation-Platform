import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiBuilding, FiPhone, FiSave, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`;

const ProfileCard = styled(motion.div)`
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
`;

const ProfileHeaderCard = styled.div`
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  padding: var(--spacing-3xl);
  text-align: center;
  color: white;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 2.5rem;
  font-weight: 700;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
`;

const UserRole = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  text-transform: capitalize;
`;

const ProfileForm = styled.form`
  padding: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 2.5rem;
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

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  opacity: ${props => props.loading ? 0.7 : 1};
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
  ` : `
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  `}
`;

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  company: yup
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .required('Company is required'),
  phone: yup
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .required('Phone is required'),
});

type FormData = yup.InferType<typeof schema>;

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUser({
        _id: user._id,
        ...data,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Profile Settings</Title>
        <Subtitle>Manage your account information and preferences.</Subtitle>
      </ProfileHeader>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeaderCard>
          <Avatar>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <UserName>{user.name}</UserName>
          <UserRole>{user.role}</UserRole>
        </ProfileHeaderCard>

        <ProfileForm onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label>Full Name</Label>
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  {...register('name')}
                  hasError={!!errors.name}
                  disabled={!isEditing}
                />
              </InputContainer>
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </FormGroup>

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
                  disabled={!isEditing}
                />
              </InputContainer>
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Company</Label>
              <InputContainer>
                <InputIcon>
                  <FiBuilding />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Enter company name"
                  {...register('company')}
                  hasError={!!errors.company}
                  disabled={!isEditing}
                />
              </InputContainer>
              {errors.company && (
                <ErrorMessage>{errors.company.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <InputContainer>
                <InputIcon>
                  <FiPhone />
                </InputIcon>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  {...register('phone')}
                  hasError={!!errors.phone}
                  disabled={!isEditing}
                />
              </InputContainer>
              {errors.phone && (
                <ErrorMessage>{errors.phone.message}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            {isEditing ? (
              <>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                  <FiSave />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button type="button" variant="primary" onClick={handleEdit}>
                <FiEdit3 />
                Edit Profile
              </Button>
            )}
          </ButtonGroup>
        </ProfileForm>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;
