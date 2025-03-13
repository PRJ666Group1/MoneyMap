import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Styled components for layout
const MainContainer = styled.div`
  padding: 20px;
  background-color: black;  /* Change background color to black */
  border-radius: 15px;
`;

const BudgetBox = styled.div`
  background-color: black;  /* Background color is now black */
  padding: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const LeftBox = styled.div`
  background-color: #69DB7C;  /* Change green color to #69DB7C */
  border-radius: 15px;
  padding: 30px;
  color: white;
  width: 45%;
`;

const RightBox = styled.div`
  background-color: #69DB7C;  /* Change green color to #69DB7C */
  border-radius: 15px;
  padding: 30px;
  color: white;
  width: 45%;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Button = styled.button`
  background-color: #397d2c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #2f6b24;
  }
`;

const PieWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LegendContainer = styled.div`
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
`;

const Alert = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: red;
  font-size: 18px;
  font-weight: bold;
`;

const ExpenseTracker = () => {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [resetGraph, setResetGraph] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [incomeToExpenseRatio, setIncomeToExpenseRatio] = useState(null);

  // Categories and colors
  const categories = [
    { name: "Rent", color: "#FF6347" }, // Red for Rent
    { name: "Food", color: "#1E90FF" }, // Blue for Food
    { name: "Groceries", color: "#FFD700" }, // Yellow for Groceries
    { name: "Utilities", color: "#8A2BE2" }, // Purple for Utilities
    { name: "Entertainment", color: "#FF4500" }, // Orange for Entertainment
    { name: "Others", color: "#FF1493" }, // Pink for Others
  ];

  const handleAddExpense = () => {
    if (!income || !expense || !category) {
      setAlertMessage("Please fill all fields");
      return;
    }

    const newExpense = {
      category,
      expense: parseFloat(expense),
    };

    setExpenseData([...expenseData, newExpense]);
    setExpense(""); // Clear the expense input after adding
    setAlertMessage(""); // Reset alert message

    setResetGraph(true); // Trigger reset
  };

  const resetPieChart = () => {
    setResetGraph(false);
  };

  const totalExpense = expenseData.reduce((acc, curr) => acc + curr.expense, 0);
  const incomeLeft = income - totalExpense;

  // Calculate the income-to-expense ratio using useEffect
  useEffect(() => {
    const ratio = (incomeLeft / income) * 100;
    setIncomeToExpenseRatio(ratio);
  }, [income, expenseData]);

  // Simple alert logic
  useEffect(() => {
    if (incomeLeft < 0) {
      setAlertMessage("Warning: Your expenses exceed your income!");
    } else if (incomeLeft < income * 0.1) {
      setAlertMessage("Alert: You are close to exceeding your budget!");
    }
  }, [incomeLeft]);

  // Data for the pie chart
  const data = [
    { name: "Income", value: incomeLeft, color: "#32CD32" }, // Green for income
    ...categories.map((category) => ({
      name: category.name,
      value: expenseData
        .filter((e) => e.category === category.name)
        .reduce((acc, curr) => acc + curr.expense, 0),
      color: category.color,
    })),
  ];

  return (
    <MainContainer>
      <BudgetBox>
        {/* Left Section - Update Budget */}
        <LeftBox>
          <h2>Update Budget</h2>
          <Input
            type="number"
            placeholder="Monthly Income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Expense Amount"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleAddExpense}>Add Expense</Button>
        </LeftBox>

        {/* Right Section - Budget Overview */}
        <RightBox>
          <h2>Budget Overview</h2>
          <PieWrapper>
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onAnimationStart={resetPieChart}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <LegendContainer>
              {data.map((entry, index) => (
                <LegendItem key={index}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: entry.color,
                      marginRight: 10,
                    }}
                  />
                  <span>{entry.name}: ${entry.value}</span>
                </LegendItem>
              ))}
            </LegendContainer>
            {/* Display Income-to-Expense Ratio */}
            {incomeToExpenseRatio !== null && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <strong>Income to Expense Ratio: {incomeToExpenseRatio.toFixed(2)}%</strong>
              </div>
            )}
          </PieWrapper>
        </RightBox>
      </BudgetBox>

      {/* Alert Message */}
      {alertMessage && <Alert>{alertMessage}</Alert>}
    </MainContainer>
  );
};

export default ExpenseTracker;
