import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Card } from "@mantine/core";

const FinancialGoalsDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from the backend (IPC)
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('get-goals');
        console.log("Response from IPC:", response); // Debugging

        // Ensure goals is an array
        setGoals(Array.isArray(response.goals) ? response.goals : []);
      } catch (err) {
        setError('Failed to fetch goals.');
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Delete a goal
  // Delete a goal and refresh the goal list
  const handleDelete = async (id) => {
    try {
      const response = await window.electron.ipcRenderer.invoke("delete-goal", id);
      if (response.success) {
        // Re-fetch the updated list of goals from the backend
        const newGoalsResponse = await window.electron.ipcRenderer.invoke("get-goals");
        setGoals(newGoalsResponse.goals);  // Update state with the new goals
      } else {
        alert("Failed to delete goal");
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };


  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>{error}</Error>;

  return (
    <Container size="xl">
      <Card bg="green.4">
        <Title>Financial Goals</Title>
        {goals.length === 0 ? (
          <NoGoals>No financial goals found.</NoGoals>
        ) : (
          <GoalsTable>
            <thead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Target Amount</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Recurring</TableHeader>
                <TableHeader>Income Amount</TableHeader>
                <TableHeader>Frequency</TableHeader>
                <TableHeader>Target Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {goals.map(goal => {
                console.log("Rendering goal:", goal.dataValues); // Debugging
                return (
                  <tr key={goal.dataValues.id}>
                    <TableData>{goal.dataValues.name}</TableData>
                    <TableData>${goal.dataValues.targetAmount}</TableData>
                    <TableData>{goal.dataValues.category}</TableData>
                    <TableData>{goal.dataValues.recurring ? "Yes" : "No"}</TableData>
                    <TableData>${goal.dataValues.incomeAmount || "N/A"}</TableData>
                    <TableData>{goal.dataValues.frequency || "N/A"}</TableData>
                    <TableData>{new Date(goal.dataValues.targetDate).toLocaleDateString()}</TableData>
                    <TableData>
                      <DeleteButton onClick={() => handleDelete(goal.dataValues.id)}>Delete</DeleteButton>
                    </TableData>
                  </tr>
                );
              })}
            </tbody>
          </GoalsTable>
        )}
      </Card>
    </Container>
  );
};

export default FinancialGoalsDashboard;

// Styled Components

// const DashboardContainer = styled.div`
//   padding: 20px;
// `;

const Title = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
`;

const Loading = styled.div`
  font-size: 1.5em;
  color: #555;
`;

const Error = styled.div`
  font-size: 1.5em;
  color: red;
`;

const NoGoals = styled.p`
  font-size: 1.2em;
  color: #555;
`;

const GoalsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
  background-color: var(--mantine-color-green-9);
`;

const TableData = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
  background-color: var(--mantine-color-green-6);
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;
