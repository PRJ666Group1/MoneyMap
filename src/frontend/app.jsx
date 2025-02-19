import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components"; // Import styled-components
import { MantineProvider } from "@mantine/core"; // Import MantineProvider
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import LeftSidebar from "./components/LeftSideBar.jsx"; // Import the LeftSidebar component
import HomePage from "./pages/HomePage.jsx";
import FinancialGoal from "./pages/FinancialGoal.jsx";
import FinancialGoalsDashboard from "./pages/FinancialGoalsDashboard.jsx";
import LogTransactions from "./pages/LogTransactions.jsx";

// Styled-components for layout
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #10151A;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HashRouter>
        <AppContainer>
          {/* Sidebar */}
          <LeftSidebar />

          {/* Main Content */}
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/log-transactions" element={<LogTransactions />} />
              <Route path="/financial-goal" element={<FinancialGoal />} />
              <Route
                path="/financial-goals-dashboard"
                element={<FinancialGoalsDashboard />}
              />
            </Routes>
          </MainContent>
        </AppContainer>
      </HashRouter>
    </MantineProvider>
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
