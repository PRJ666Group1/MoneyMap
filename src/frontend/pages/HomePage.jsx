import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dollarImg from '../assets/images/dollar.svg';  // Importing the SVG as a source
import { Container, Card, Flex } from '@mantine/core';

// Styled-components for styling the page
// const Container = styled.div`
//   border-radius: 15px;
//   text-align: center;
//   padding: 50px;
//   background-color: #f4f4f4;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 30px;
`;

// const Button = styled.button`
//   padding: 12px 25px;
//   font-size: 16px;
//   background-color: #4caf50;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #45a049;
//   }
// `;

// HomePage Component
const HomePage = () => {
  return (
    <Container size="xl">
      <Card bg="green.4">
        <Flex direction="column" justify="center" align="center">
          <Title>Welcome to MoneyMap</Title>
          <SubTitle>Your financial management app</SubTitle>
          <img src={dollarImg} alt="Logo" width={100} height={100} />  {/* Using the SVG as an image */}
        </Flex>
      </Card>
    </Container>
  );
};

export default HomePage;