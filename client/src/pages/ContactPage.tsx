import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiBuilding, FiPhone, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: var(--spacing-3xl) var(--spacing-lg);
`;

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
`;

const Title = styled(motion.h1)`
  color: var(--color-text);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const InfoCard = styled.div`
  background: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
`;

const InfoText = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
`;

const ContactForm = styled(motion.form)`
  background: var(--color-surface);
  padding: var(--spacing-3xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormTitle = styled.h2`
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 480px) {
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

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-background);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
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
  top: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.875rem;
`;

const SubmitButton = styled.button<{ loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
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
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
});

type FormData = yup.InferType<typeof schema>;

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      text: 'contact@thinkai3.com',
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      text: '+1 (555) 123-4567',
    },
    {
      icon: FiBuilding,
      title: 'Visit Us',
      text: '123 Cyber Street, Tech City, TC 12345',
    },
  ];

  return (
    <ContactContainer>
      <ContactContent>
        <ContactHeader>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have questions about our cybersecurity solutions? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </Subtitle>
        </ContactHeader>

        <ContactGrid>
          <ContactInfo
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {contactInfo.map((info, index) => (
              <InfoCard key={index}>
                <InfoIcon>
                  <info.icon />
                </InfoIcon>
                <InfoContent>
                  <InfoTitle>{info.title}</InfoTitle>
                  <InfoText>{info.text}</InfoText>
                </InfoContent>
              </InfoCard>
            ))}
          </ContactInfo>

          <ContactForm
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormTitle>Send us a message</FormTitle>

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
                  />
                </InputContainer>
                {errors.phone && (
                  <ErrorMessage>{errors.phone.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                placeholder="Enter subject"
                {...register('subject')}
                hasError={!!errors.subject}
              />
              {errors.subject && (
                <ErrorMessage>{errors.subject.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <InputContainer>
                <InputIcon style={{ top: 'var(--spacing-md)' }}>
                  <FiMessageSquare />
                </InputIcon>
                <TextArea
                  placeholder="Enter your message"
                  {...register('message')}
                  hasError={!!errors.message}
                />
              </InputContainer>
              {errors.message && (
                <ErrorMessage>{errors.message.message}</ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" loading={loading}>
              <FiSend />
              {loading ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </ContactGrid>
      </ContactContent>
    </ContactContainer>
  );
};

export default ContactPage;
