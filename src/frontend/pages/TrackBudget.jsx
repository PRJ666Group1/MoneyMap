import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import { Container, Card, Title, NumberInput, Group, Button, Modal, Input, Stack, Select, Alert, Flex, Box } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { useDisclosure } from '@mantine/hooks';

// Utility function to generate random colors
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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
  const [incomeToExpenseRatio, setIncomeToExpenseRatio] = useState(null);
  const [budgetId, setBudgetId] = useState(null);
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);
  const [expenseModalOpened, { open: expenseModalOpen, close: expenseModalClose }] = useDisclosure(false);

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
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to load budget data. Please try again',
      })
    }
  };

  // Handle adding expense
  const handleAddExpense = async () => {
    if (!expense || !category) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Please fill all fields',
      })
      return;
    }

    if (!income) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Please enter your monthly income first',
      })
      return;
    }

    // Parse values to ensure they're numbers
    const incomeValue = parseFloat(income) || 0;
    const expenseValue = parseFloat(expense);

    if (isNaN(expenseValue)) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Please enter a valid expense amount',
      })
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
        console.log("Added expense:", { category, expense: expenseValue });
      } else {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: result.error || 'Failed to save expense. Please try again',
        })
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error saving expense. Please try again',
      })
    }
  };

  // Add custom category
  const handleAddCategory = () => {
    if (customCategory) {
      const newCategory = { name: customCategory, color: generateRandomColor() };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setCustomCategory(""); // Reset custom category field
      categoryModalClose(); // Close the modal
    }
  };

  // Delete specific expense
  const handleDeleteExpense = async (categoryToDelete) => {
    try {
      // Find the expense by category
      const expenseToDelete = expenseData.find(expense => expense.category === categoryToDelete);

      if (!expenseToDelete || !expenseToDelete.id) {
        notifications.show({
          color: 'red',
          title: 'Cannot Delete Expense',
          message: 'Expense not found in database',
        })
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
        console.log(`Deleted expense with category: ${categoryToDelete}`);
      } else {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: response.error || 'Failed to delete expense',
        })
        console.error("Failed to delete expense:", response);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error deleting expense',
      })
    }
  };

  // Save all budget data to database
  const handleSaveBudget = async () => {
    if (parseFloat(income) <= 0) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Please enter a valid income amount before saving',
      })
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

        notifications.show({
          color: 'green',
          message: 'Budget Saved Successfully!',
        })

        // Refresh budgets to ensure we have the latest data
        fetchBudgets();

        // Clear the alert message after 3 seconds
        setTimeout(() => {
        }, 3000);
      } else {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: response.error || 'Error saving budget. Please try again',
        })
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error saving budget. Please try again',
      })
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
        notifications.show({
          color: 'red',
          title: 'Alert',
          message: 'Your expenses exceed your income',
        })
      } else if (incomeLeft < incomeValue * 0.1) {
        notifications.show({
          color: 'yellow',
          title: 'Warning',
          message: 'You are close to exceeding your budget',
        })
      }
    }
  }, [incomeLeft, income]);

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
    <>
      <Container fluid>
        <Flex justify="space-between" align="start" gap="md">
          {/* Left Section - Update Budget */}
          <Card shadow="xs" padding="md" w="50%" bg="green.4">
            <Title order={2}>Update Budget</Title>

            <NumberInput placeholder="Monthly Income" allowNegative={false} value={income} onChange={setIncome} />

            <Group mt="md">
              <Button onClick={categoryModalOpen}>Add Custom Category</Button>
              <Button onClick={expenseModalOpen}>Add Expense</Button>
            </Group>

            <Button fullWidth mt="md" onClick={handleSaveBudget}>
              {budgetId ? "Update Budget" : "Save Budget"}
            </Button>
          </Card>

          {/* Right Section - Budget Overview */}
          <Card shadow="xs" padding="md" w="50%" bg="green.4">
            <Title order={2}>Budget Overview</Title>

            {chartData.length > 0 ? (
              <Stack align="center">
                <PieChart width={300} height={300}>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" startAngle={180} endAngle={-180}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>

                <Stack spacing="xs">
                  {chartData.map((entry, index) => (
                    <Group key={index} spacing="xs">
                      <Box w={20} h={20} bg={entry.color} />
                      <span>{entry.name}: ${entry.value.toFixed(2)}</span>
                      {entry.name !== "Income Left" && entry.name !== "Income" && (
                        <Button compact size="xs" onClick={() => handleDeleteExpense(entry.name)}>Delete</Button>
                      )}
                    </Group>
                  ))}
                </Stack>

                {incomeToExpenseRatio !== null && (
                  <Title order={4} mt="md">Income to Expense Ratio: {incomeToExpenseRatio.toFixed(2)}%</Title>
                )}
              </Stack>
            ) : (
              <Box ta="center" py="lg">
                {income > 0 ? "Add expenses to see the budget overview" : "Please enter your monthly income"}
              </Box>
            )}
          </Card>
        </Flex>
      </Container>

      {/* Add Custom Category Modal */}
      <Modal centered opened={categoryModalOpened} onClose={categoryModalClose} title="Add Custom Category">
        <Input placeholder="Name of Custom Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
        <Button fullWidth mt="md" onClick={handleAddCategory}>Add</Button>
      </Modal>

      {/* Add Expense Modal */}
      <Modal centered opened={expenseModalOpened} onClose={expenseModalClose} title="Add Expense">
        <Stack>
          <NumberInput placeholder="Expense Amount" value={expense} onChange={setExpense} />
          <Select placeholder="Select Category" value={category} onChange={setCategory} data={categories.map((item) => item.name)} />
          <Button onClick={handleAddExpense}>Add Expense</Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ExpenseTracker;