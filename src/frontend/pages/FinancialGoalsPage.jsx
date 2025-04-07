import React from 'react';
import { useState } from 'react';
import styled from "styled-components";
import FinancialGoal from "./FinancialGoal.jsx";
import FinancialGoalsDashboard from "./FinancialGoalsDashboard.jsx";

// Styled Components
const PageContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(135deg, #2b5f20, #54c166);
  min-height: 100vh;
`;

export default function FinancialGoalPage() {
    const [goalAdded, setGoalAdded] = useState(false);

    // Function to set the flag when a goal is added
    const handleGoalAdded = () => {
        setGoalAdded(true); // Set goalAdded to true when a new goal is added
    };

    return (
        <PageContainer>
            <FinancialGoal onGoalAdded={handleGoalAdded} />
            <FinancialGoalsDashboard goalAdded={goalAdded} setGoalAdded={setGoalAdded} />
        </PageContainer>
    );
}
