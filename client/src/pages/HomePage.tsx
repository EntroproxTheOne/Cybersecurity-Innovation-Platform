import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShield, FiBrain, FiLock, FiEye, FiZap, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: var(--spacing-3xl) var(--spacing-lg);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroText = styled.div`
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #00d4ff, #0099cc, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  
  &.primary {
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
    
    &:hover {
      background: var(--color-primary);
      color: var(--color-background);
      transform: translateY(-2px);
    }
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CyberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  width: 300px;
  height: 300px;
`;

const GridItem = styled(motion.div)`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: var(--radius-lg);
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const FeaturesSection = styled.section`
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: var(--color-background);
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
`;

const SectionDescription = styled(motion.p)`
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto var(--spacing-3xl);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  text-align: center;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-10px);
    border-color: var(--color-primary);
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 2rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
`;

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  const features = [
    {
      icon: FiShield,
      title: 'AI-Powered Threat Detection',
      description: 'Machine learning algorithms that continuously evolve to identify and neutralize emerging threats before they can cause damage.'
    },
    {
      icon: FiBrain,
      title: 'Decentralized Architecture',
      description: 'Distributed network design that eliminates single points of failure and ensures maximum resilience against attacks.'
    },
    {
      icon: FiEye,
      title: 'Real-time Monitoring',
      description: '24/7 surveillance of your digital infrastructure with instant alerts and automated response capabilities.'
    },
    {
      icon: FiLock,
      title: 'Advanced Encryption',
      description: 'Military-grade encryption protocols that protect your data both in transit and at rest.'
    },
    {
      icon: FiZap,
      title: 'Automated Response',
      description: 'Intelligent systems that automatically respond to threats without human intervention, minimizing response time.'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics & Reporting',
      description: 'Comprehensive insights into security posture with detailed reports and predictive analytics.'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroText>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Next-Generation <GradientText>Cybersecurity</GradientText> with AI
            </HeroTitle>
            <HeroDescription
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A decentralized paradigm for cybersecurity that leverages artificial intelligence 
              to protect digital assets and ensure secure communications in the modern world.
            </HeroDescription>
            <ButtonGroup
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button to="/register" className="primary">
                Get Started
              </Button>
              <Button to="/login" className="secondary">
                Sign In
              </Button>
            </ButtonGroup>
          </HeroText>
          
          <HeroVisual
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CyberGrid>
              {Array.from({ length: 9 }).map((_, i) => (
                <GridItem
                  key={i}
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </CyberGrid>
            
            <FloatingIcon
              style={{ top: '20%', left: '10%' }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FiShield />
            </FloatingIcon>
            
            <FloatingIcon
              style={{ top: '60%', right: '20%' }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <FiLock />
            </FloatingIcon>
            
            <FloatingIcon
              style={{ bottom: '20%', left: '30%' }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            >
              <FiBrain />
            </FloatingIcon>
          </HeroVisual>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Key Features
        </SectionTitle>
        <SectionDescription
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Advanced capabilities that set us apart in the cybersecurity landscape
        </SectionDescription>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <FeatureIcon>
                <feature.icon />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;
