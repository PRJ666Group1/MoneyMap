import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Utility function to generate random colors
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Styled components for layout
const MainContainer = styled.div`
  padding: 20px;
  background-color: black;
  border-radius: 15px;
`;

const BudgetBox = styled.div`
  background-color: black;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const LeftBox = styled.div`
  background-color: #69DB7C;
  border-radius: 15px;
  padding: 30px;
  color: white;
  width: 45%;
`;

const RightBox = styled.div`
  background-color: #69DB7C;
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
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: #2f6b24;
  }

  &:not(:first-child) {
    margin-left: 10px;
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
  justify-content: space-between;
  margin: 5px 0;
  align-items: center;
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
  const [customCategory, setCustomCategory] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([
    { name: "Rent", color: "#FF6347" },
    { name: "Food", color: "#1E90FF" },
    { name: "Groceries", color: "#FFD700" },
    { name: "Utilities", color: "#8A2BE2" },
    { name: "Entertainment", color: "#FF4500" },
  ]);
  const [alertMessage, setAlertMessage] = useState("");
  const [incomeToExpenseRatio, setIncomeToExpenseRatio] = useState(null);

  // Fetch budgets from database
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke("get-budgets");
        if (result.success) {
          const budgets = result.budgets;

          if (budgets.length > 0) {
            setIncome(budgets[0].income || ""); 
            setExpenseData(
              budgets.map((budget) => ({
                category: budget.category,
                expense: parseFloat(budget.expense),
              }))
            );
          }
        } else {
          console.error("Failed to fetch budgets:", result.error);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, []);

   // Handle adding expense
  const handleAddExpense = async () => {
    if (!income || !expense || !category) {
      setAlertMessage("Please fill all fields");
      return;
    }


    // Prepare the budget data with income, expense, and category
    const budgetData = {
      income: parseFloat(income),  // Assuming income is being set elsewhere in your app
      expenseAmount: parseFloat(expense),
      category: category
    };

    console.log('Sending Budget Data:', budgetData);

    // IPC call to save expense to database
    try {
      await window.electron.ipcRenderer.invoke("create-budget", {
        budgetData
      });
    } catch (error) {
      console.error("Error saving expense:", error);
      setAlertMessage("Failed to save the expense. Please try again.");
    }

    const updatedExpenseData = [...expenseData];
    const existingExpense = updatedExpenseData.find((e) => e.category === category);

    if (existingExpense) {
      existingExpense.expense = parseFloat(expense); // Update existing expense
    } else {
      const newExpense = { category, expense: parseFloat(expense) };
      updatedExpenseData.push(newExpense); // Add new expense
    }

    setExpenseData(updatedExpenseData);
    setExpense(""); // Clear the expense input after adding
    setAlertMessage(""); // Reset alert message

   
  };

  // Add custom category with a random color
  const handleAddCategory = () => {
    if (customCategory) {
      const newCategory = { name: customCategory, color: generateRandomColor() };
      setCategories([...categories, newCategory]);
      setCustomCategory(""); // Reset custom category field
    }
  };

  // Clear all data (except income)
  const handleClearAll = () => {
    setExpenseData([]); // Clear all expense data
    setIncome(""); // Reset income field
    setCategory(""); // Reset category
    setExpense(""); // Reset expense input
    setCustomCategory(""); // Reset custom category input
    setAlertMessage(""); // Clear any alert messages
  };

  // Delete specific expense
  const handleDeleteExpense = async (id) => {
    // setExpenseData(expenseData.filter((expense) => expense.category !== categoryToDelete));
    try {
      // Sending the category to delete
      const response = await window.electron.ipcRenderer.invoke("delete-budget", id);
  
      if (response.success) {
        // Re-fetch the updated list of expenses
        const newExpensesResponse = await window.electron.ipcRenderer.invoke("get-budgets");
        if (newExpensesResponse.expenses) {
          setExpenseData(newExpensesResponse.expenses);
        } else {
          setAlertMessage("Failed to delete expense, invalid response");
          console.error("Failed to delete expense, invalid response");
        }
      } else {
        setAlertMessage("Failed to delete expense");
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      setAlertMessage("Error deleting expense");
    }
  };

   

  const totalExpense = expenseData.reduce((acc, curr) => acc + curr.expense, 0);
  const incomeLeft = income - totalExpense;

  useEffect(() => {
    const ratio = (incomeLeft / income) * 100;
    setIncomeToExpenseRatio(ratio);
  }, [income, expenseData]);

  useEffect(() => {
    if (incomeLeft < 0) {
      setAlertMessage("Warning: Your expenses exceed your income!");
    } else if (incomeLeft < income * 0.1) {
      setAlertMessage("Alert: You are close to exceeding your budget!");
    }
  }, [incomeLeft]);

  const data = [
    { name: "Income", value: incomeLeft, color: "#32CD32" },
    ...categories
      .map((category) => ({
        name: category.name,
        value: expenseData.filter((e) => e.category === category.name).reduce((acc, curr) => acc + curr.expense, 0),
        color: category.color,
      }))
      .filter((category) => category.value > 0), // Filter out categories with $0 value
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
          <Input
            type="text"
            placeholder="Custom Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
          <Button onClick={handleAddCategory}>Add Custom Category</Button>
          <Button onClick={handleAddExpense}>Add Expense</Button>
          <Button onClick={handleClearAll}>Clear All</Button>
        </LeftBox>

        {/* Right Section - Budget Overview */}
        <RightBox>
          <h2>Budget Overview</h2>
          <PieWrapper>
            <PieChart width={300} height={300}>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
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
                    {entry.name !== "Income" && (
                      <Button
                        onClick={() => handleDeleteExpense(entry.id)} // Pass entry.id instead of entry.name
                        style={{ fontSize: "12px", padding: "5px 10px" }}
                      >
                        Delete
                      </Button>
                    )}
                  </LegendItem>
              ))}
            </LegendContainer>
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
