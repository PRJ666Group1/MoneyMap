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

const SaveButton = styled(Button)`
  background-color: #397d2c;
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
  
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
  // Initialize income as a number rather than an empty string
  const [income, setIncome] = useState(0);
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
  const [budgetId, setBudgetId] = useState(null);

  // Fetch budgets from database on component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Function to fetch budgets from database
  const fetchBudgets = async () => {
    try {
      console.log("Fetching budgets from database...");
      const result = await window.electron.ipcRenderer.invoke("get-budgets");
      console.log("Fetched budgets result:", result);
      
      if (result.success && result.budgets && result.budgets.length > 0) {
        // Process the budgets data
        let incomeEntry = null;
        const expenses = [];
        let customCats = null;
        
        // Loop through all budgets to find income and expenses
        result.budgets.forEach(budget => {
          if (budget.category === 'Income') {
            incomeEntry = budget;
            // If we have categories stored as JSON, parse them
            if (budget.categories) {
              try {
                customCats = typeof budget.categories === 'string' 
                  ? JSON.parse(budget.categories) 
                  : budget.categories;
              } catch (e) {
                console.error("Error parsing categories:", e);
              }
            }
          } else {
            // This is an expense entry
            expenses.push({
              id: budget.id,
              category: budget.category,
              expense: parseFloat(budget.expense)
            });
          }
        });
        
        // Set the income if we found an income entry
        if (incomeEntry) {
          setIncome(parseFloat(incomeEntry.income));
          setBudgetId(incomeEntry.id);
        }
        
        // Set expense data
        setExpenseData(expenses);
        
        // Set custom categories if we found them
        if (customCats && Array.isArray(customCats) && customCats.length > 0) {
          setCategories(customCats);
        }
        
        console.log("Data loaded from database: income =", incomeEntry?.income, "expenses =", expenses);
      } else {
        console.log("No budgets found in database or fetch failed");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setAlertMessage("Failed to load budget data. Please try again.");
    }
  };

  // Handle adding expense
  const handleAddExpense = async () => {
    if (!expense || !category) {
      setAlertMessage("Please fill all fields");
      return;
    }

    if (!income) {
      setAlertMessage("Please enter your monthly income first");
      return;
    }

    // Parse values to ensure they're numbers
    const incomeValue = parseFloat(income) || 0;
    const expenseValue = parseFloat(expense);
    
    if (isNaN(expenseValue)) {
      setAlertMessage("Please enter a valid expense amount");
      return;
    }

    // Update local state
    const updatedExpenseData = [...expenseData];
    const existingExpenseIndex = updatedExpenseData.findIndex((e) => e.category === category);
    
    // Prepare budget data for database
    const budgetData = {
      income: incomeValue,
      category: category,
      expenseAmount: expenseValue
    };
    
    try {
      let result;
      
      if (existingExpenseIndex >= 0) {
        // Update existing expense in database
        const existingId = updatedExpenseData[existingExpenseIndex].id;
        console.log(`Updating expense with ID ${existingId}:`, budgetData);
        
        result = await window.electron.ipcRenderer.invoke("update-budget", {
          id: existingId,
          budgetData
        });
        
        if (result.success) {
          // Update local state
          updatedExpenseData[existingExpenseIndex].expense = expenseValue;
        }
      } else {
        // Create new expense in database
        console.log("Creating new expense:", budgetData);
        
        result = await window.electron.ipcRenderer.invoke("create-budget", {
          budgetData
        });
        
        if (result.success && result.budget) {
          // Add new expense to local state with ID from database
          updatedExpenseData.push({
            id: result.budget.id,
            category,
            expense: expenseValue
          });
        }
      }
      
      if (result.success) {
        // Update state
        setExpenseData(updatedExpenseData);
        setExpense(""); // Clear expense input
        setCategory(""); // Reset category selection
        setAlertMessage(""); // Clear alert message
        console.log("Added expense:", { category, expense: expenseValue });
      } else {
        setAlertMessage(result.error || "Failed to save expense. Please try again.");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      setAlertMessage("Error saving expense. Please try again.");
    }
  };

  // Add custom category
  const handleAddCategory = () => {
    if (customCategory) {
      const newCategory = { name: customCategory, color: generateRandomColor() };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setCustomCategory(""); // Reset custom category field
    }
  };

  // Delete specific expense
  const handleDeleteExpense = async (categoryToDelete) => {
    try {
      // Find the expense by category
      const expenseToDelete = expenseData.find(expense => expense.category === categoryToDelete);
      
      if (!expenseToDelete || !expenseToDelete.id) {
        setAlertMessage("Cannot delete expense: missing ID");
        return;
      }
      
      console.log(`Deleting expense with ID ${expenseToDelete.id}, category: ${categoryToDelete}`);
      
      // Send delete request to backend
      const response = await window.electron.ipcRenderer.invoke("delete-budget", expenseToDelete.id);
      
      if (response.success) {
        // Update local state
        const updatedExpenseData = expenseData.filter(expense => 
          expense.category !== categoryToDelete
        );
        setExpenseData(updatedExpenseData);
        setAlertMessage(""); // Clear any error messages
        console.log(`Deleted expense with category: ${categoryToDelete}`);
      } else {
        setAlertMessage(response.error || "Failed to delete expense");
        console.error("Failed to delete expense:", response);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      setAlertMessage("Error deleting expense");
    }
  };

  // Save all budget data to database
  const handleSaveBudget = async () => {
    if (parseFloat(income) <= 0) {
      setAlertMessage("Please enter a valid income amount before saving");
      return;
    }
    
    try {
      // Prepare budget data
      const budgetData = {
        income: parseFloat(income),
        expenses: expenseData,
        categories: categories 
      };
      
      console.log("Would save budget:", budgetData);
      
      // Send to database
      const response = await window.electron.ipcRenderer.invoke(
        "save-budget", 
        budgetData
      );
      
      if (response.success) {
        // Update local state with the new ID if this was a new budget
        if (response.id) {
          setBudgetId(response.id);
        }
        setAlertMessage("Budget saved successfully!");
        
        // Refresh budgets to ensure we have the latest data
        fetchBudgets();
        
        // Clear the alert message after 3 seconds
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
      } else {
        setAlertMessage(response.error || "Error saving budget. Please try again.");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      setAlertMessage("Error saving budget. Please try again.");
    }
  };

  // Calculate totals
  const totalExpense = expenseData.reduce((acc, curr) => acc + curr.expense, 0);
  const incomeLeft = parseFloat(income) - totalExpense;

  // Calculate income to expense ratio
  useEffect(() => {
    const incomeValue = parseFloat(income);
    if (incomeValue > 0) {
      // Calculate percentage of income spent
      const percentageSpent = (totalExpense / incomeValue) * 100;
      setIncomeToExpenseRatio(percentageSpent);
    } else {
      setIncomeToExpenseRatio(0);
    }
  }, [income, totalExpense]);

  // Set alerts based on budget status
  useEffect(() => {
    const incomeValue = parseFloat(income);
    
    if (incomeValue > 0) {
      if (incomeLeft < 0) {
        setAlertMessage("Warning: Your expenses exceed your income!");
      } else if (incomeLeft < incomeValue * 0.1) {
        setAlertMessage("Alert: You are close to exceeding your budget!");
      } else {
        // Only clear alert if it's a budget warning (not a success/error message)
        if (alertMessage && (alertMessage.includes("Warning:") || alertMessage.includes("Alert:"))) {
          setAlertMessage("");
        }
      }
    }
  }, [incomeLeft, income, alertMessage]);

  // Prepare data for pie chart
  const chartData = [
    { name: "Income Left", value: incomeLeft > 0 ? incomeLeft : 0, color: "#32CD32" },
    ...expenseData.map(item => {
      const categoryInfo = categories.find(cat => cat.name === item.category) || 
                          { name: item.category, color: "#999999" };
      return {
        name: item.category,
        value: item.expense,
        color: categoryInfo.color
      };
    })
  ].filter(item => item.value > 0);
  
  // If no chart data but we have income, show full income
  if (chartData.length === 0 && parseFloat(income) > 0) {
    chartData.push({ 
      name: "Income", 
      value: parseFloat(income),
      color: "#32CD32" 
    });
  }

  return (
    <MainContainer>
      <BudgetBox>
        {/* Left Section - Update Budget */}
        <LeftBox>
          <h2>Update Budget</h2>
          <Input
            type="number"
            placeholder="Monthly Income"
            value={income || ""}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : 0;
              setIncome(val);
            }}
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
          
          {/* Save button for sending all data to database */}
          <SaveButton onClick={handleSaveBudget}>
            {budgetId ? "Update Budget" : "Save Budget"}
          </SaveButton>
        </LeftBox>

        {/* Right Section - Budget Overview */}
        <RightBox>
          <h2>Budget Overview</h2>
          <PieWrapper>
            {chartData.length > 0 ? (
              <>
                <PieChart width={300} height={300}>
                  <Pie 
                    data={chartData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value"
                    startAngle={180}
                    endAngle={-180}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
                
                <LegendContainer>
                  {/* Always show Income Left first */}
                  {chartData.map((entry, index) => {
                    if (entry.name === "Income Left" || entry.name === "Income") {
                      return (
                        <LegendItem key={index}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: entry.color,
                              marginRight: 10,
                            }}
                          />
                          <span>{entry.name}: ${entry.value.toFixed(2)}</span>
                        </LegendItem>
                      );
                    } 
                    return null;
                  })}
                  
                  {/* Then show all expenses with delete buttons */}
                  {chartData.map((entry, index) => {
                    if (entry.name !== "Income Left" && entry.name !== "Income") {
                      return (
                        <LegendItem key={`expense-${index}`}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: entry.color,
                              marginRight: 10,
                            }}
                          />
                          <span>{entry.name}: ${entry.value.toFixed(2)}</span>
                          <Button
                            onClick={() => handleDeleteExpense(entry.name)}
                            style={{ fontSize: "12px", padding: "5px 10px" }}
                          >
                            Delete
                          </Button>
                        </LegendItem>
                      );
                    }
                    return null;
                  })}
                </LegendContainer>
                
                {incomeToExpenseRatio !== null && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <strong>Income to Expense Ratio: {incomeToExpenseRatio.toFixed(2)}%</strong>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                {income > 0 ? "Add expenses to see the budget overview" : "Please enter your monthly income"}
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