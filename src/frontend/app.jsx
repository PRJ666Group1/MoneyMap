import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components"; // Import styled-components

import LeftSidebar from "./components/LeftSideBar.jsx"; // Import the LeftSidebar component
import HomePage from "./pages/HomePage.jsx";
import FinancialGoal from "./pages/FinancialGoal.jsx";
import FinancialGoalsDashboard from "./pages/FinancialGoalsDashboard.jsx";

// Styled-components for layout
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #397d2c;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 300px; /* Adjust based on the width of the sidebar */
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        {/* Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <MainContent>
          <Routes>
            <Route path="/main_window" element={<HomePage />} />
            <Route path="/financial-goal" element={<FinancialGoal />} />
            <Route path="/financial-goals-dashboard" element={<FinancialGoalsDashboard />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

// Ensure there's a root div in your HTML (index.html)
const rootElement = document.getElementById("root");
if (!rootElement) {
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
  createRoot(newRoot).render(<App />);
} else {
  createRoot(rootElement).render(<App />);
}
