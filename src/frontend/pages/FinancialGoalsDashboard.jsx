import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Card, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const FinancialGoalsDashboard = ({ goalAdded, setGoalAdded }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from the backend (IPC), as a separate function outside of useEffect so it can be reused
   const fetchGoals = async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke("get-goals");
      console.log("Response from IPC:", response); // Debugging

      // Ensure goals is an array
      setGoals(Array.isArray(response.goals) ? response.goals : []);
    } catch (err) {
      setError("Failed to fetch goals.");
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
      setGoalAdded(false); // Reset goalAdded flag to false after fetching goals
    }
  };


  // Fetch goals on initial render
  useEffect(() => {
    fetchGoals();
  }, []);

   // Re-fetch goals when `goalAdded` changes
   useEffect(() => {
    //console.log("goalAdded changed: ", goalAdded);  // Debugging
    if (goalAdded) {
      fetchGoals(); // Trigger goal fetch when goalAdded changes
    }
  }, [goalAdded]);

  // Delete a goal and refresh the goal list
  const handleDelete = async (id) => {
    try {
      const response = await window.electron.ipcRenderer.invoke("delete-goal", id);
      if (response.success) {
        // Re-fetch the updated list of goals from the backend
        const newGoalsResponse = await window.electron.ipcRenderer.invoke("get-goals");
        setGoals(newGoalsResponse.goals); // Update state with the new goals
        notifications.show({
          color: "green",
          title: "Success",
          message: "Goal deleted successfully!",
        });
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: response.error,
        });
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "An error occurred while deleting the goal.",
      });
    }
  };

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>{error}</Error>;

  return (
    <PageContainer>
     

      {/* Main Content */}
      <ContentContainer>
        <StyledCard>
        {goals.length > 0 && (
          <Title>Financial Goals Dashboard</Title>
        )}

          {goals.length === 0 ? (
            <NoGoalsMessage>No financial goals found.</NoGoalsMessage>
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
                {goals.map((goal) => (
                  <TableRow key={goal.dataValues.id}>
                    <TableData>{goal.dataValues.name}</TableData>
                    <TableData>${goal.dataValues.targetAmount}</TableData>
                    <TableData>{goal.dataValues.category}</TableData>
                    <TableData>{goal.dataValues.recurring ? "Yes" : "No"}</TableData>
                    <TableData>
                      {goal.dataValues.incomeAmount
                        ? `$${goal.dataValues.incomeAmount}`
                        : "N/A"}
                    </TableData>
                    <TableData>{goal.dataValues.frequency || "N/A"}</TableData>
                    <TableData>
                      {new Date(goal.dataValues.targetDate).toLocaleDateString()}
                    </TableData>
                    <TableData>
                      <DeleteButton onClick={() => handleDelete(goal.dataValues.id)}>
                        Delete
                      </DeleteButton>
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </GoalsTable>
          )}
        </StyledCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default FinancialGoalsDashboard;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  //background: linear-gradient(135deg, #2b5f20, #54c166);
  padding: 20px;
  font-family: "Montserrat", sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #397d2c, #69db7c);
  color: white;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
`;

const ContentContainer = styled(Container)`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const NoGoalsMessage = styled(Text)`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
`;

const GoalsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #397d2c;
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #e6ffe6;
    cursor: pointer;
  }
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ff6666;
  }
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #555;
  text-align: center;
`;

const Error = styled.div`
  font-size: 1.5rem;
  color: red;
  text-align: center;
`;