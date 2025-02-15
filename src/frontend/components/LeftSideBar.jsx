import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import the Link component

// Define the styled components for the sidebar
const SidebarContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 20px;
  left: 20px;
  height: 90vh;
`;

const Logo = styled.h1`
  font-size: 24px;
  margin: 0;
  color: #397d2c;
  text-align: center;
  margin-bottom: 30px;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
  }

  a {
    color: #397d2c;
    text-decoration: none;
    font-size: 18px;
    padding: 10px;
    display: block;
    border-radius: 8px;
    transition: background-color 0.3s;
    border: 1px dotted #397d2c;
    

    &:hover {
      background-color: #397d2c;
      color: white;
      font-weight: bold;
    }
  }
`;

// LeftSidebar Component
const LeftSidebar = () => {
  return (
    <SidebarContainer>
      <Logo>MoneyMap</Logo>
      <Nav>
        <ul>
          <li><Link to="/main_window">Home</Link></li>
          <li><Link to="/log-transactions">Log transactions</Link></li>
          <li><Link to="/track-budget">Track budget, Income & Expenses</Link></li>
          <li><Link to="/financial-goal">Set financial goals</Link></li>
          <li><Link to="/financial-goals-dashboard">Financial goals dashboard</Link></li>
        </ul>
      </Nav>
    </SidebarContainer>
  );
};

export default LeftSidebar;
