import * as React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Container, Flex, MantineProvider } from "@mantine/core"; // Import MantineProvider
import { Notifications } from '@mantine/notifications';
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

import LeftSidebar from "./components/LeftSideBar.jsx"; // Import the LeftSidebar component
import HomePage from "./pages/HomePage.jsx";
import FinancialGoal from "./pages/FinancialGoal.jsx";
import FinancialGoalsDashboard from "./pages/FinancialGoalsDashboard.jsx";
import LogTransactions from "./pages/LogTransactions.jsx";
import TrackBudget from "./pages/TrackBudget.jsx"; // Import TrackBudget
import Settings from "./pages/Settings.jsx"; // Import Settings

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <HashRouter>
        <Flex mih="100vh" bg="gray.9">
          {/* Sidebar */}
          <LeftSidebar />

          {/* Main Content */}
          <Container fluid flex={1} p="xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/log-transactions" element={<LogTransactions />} />
              <Route path="/financial-goal" element={<FinancialGoal />} />
              <Route
                path="/financial-goals-dashboard"
                element={<FinancialGoalsDashboard />
                }
              />
              <Route path="/track-budget" element={<TrackBudget />} /> {/* Add the new route here */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </Flex>
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
