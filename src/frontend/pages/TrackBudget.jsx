import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Title,
  NumberInput,
  Group,
  Button,
  Modal,
  Input,
  Stack,
  Select,
  Grid,
  ThemeIcon,
  Text,
  Tabs,
  Table,
} from "@mantine/core";
import { PieChart, BarChart, LineChart } from "@mantine/charts"; // Re-added LineChart
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { IoIosClose } from "react-icons/io";

// Utility function to generate random colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ExpenseTracker = () => {
  // State variables
  const [tempIncome, setTempIncome] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
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
  const [showCharts, setShowCharts] = useState(false); // Toggle charts visibility
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);
  const [expenseModalOpened, { open: expenseModalOpen, close: expenseModalClose }] = useDisclosure(false);
  const [updateIncomeModalOpened, { open: updateIncomeModalOpen, close: updateIncomeModalClose }] = useDisclosure(false);

  // Fetch budgets from database on component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Function to fetch budgets from database
  const fetchBudgets = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke("get-budgets");
      if (result.success && result.budgets && result.budgets.length > 0) {
        let incomeEntry = null;
        const expenses = [];
        let customCats = null;

        result.budgets.forEach((budget) => {
          if (budget.category === "Income") {
            incomeEntry = budget;
            if (budget.categories) {
              try {
                customCats =
                  typeof budget.categories === "string"
                    ? JSON.parse(budget.categories)
                    : budget.categories;
              } catch (e) {
                console.error("Error parsing categories:", e);
              }
            }
          } else {
            expenses.push({
              id: budget.id,
              category: budget.category,
              expense: parseFloat(budget.expense),
            });
          }
        });

        if (incomeEntry) {
          setIncome(parseFloat(incomeEntry.income));
          setBudgetId(incomeEntry.id);
        }

        setExpenseData(expenses);

        if (customCats && Array.isArray(customCats) && customCats.length > 0) {
          setCategories(customCats);
        }
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to load budget data. Please try again",
      });
    }
  };

  // Handle adding expense
  const handleAddExpense = async () => {
    if (!expense || !category) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please fill all fields",
      });
      return;
    }

    if (!income) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please enter your monthly income first",
      });
      return;
    }

    const incomeValue = parseFloat(income) || 0;
    const expenseValue = parseFloat(expense);

    if (isNaN(expenseValue)) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please enter a valid expense amount",
      });
      return;
    }

    const updatedExpenseData = [...expenseData];
    const existingExpenseIndex = updatedExpenseData.findIndex((e) => e.category === category);

    const budgetData = {
      income: incomeValue,
      category: category,
      expenseAmount: expenseValue,
    };

    try {
      let result;

      if (existingExpenseIndex >= 0) {
        const existingId = updatedExpenseData[existingExpenseIndex].id;
        result = await window.electron.ipcRenderer.invoke("update-budget", {
          id: existingId,
          budgetData,
        });

        if (result.success) {
          updatedExpenseData[existingExpenseIndex].expense = expenseValue;
        }
      } else {
        result = await window.electron.ipcRenderer.invoke("create-budget", {
          budgetData,
        });

        if (result.success && result.budget) {
          updatedExpenseData.push({
            id: result.budget.id,
            category,
            expense: expenseValue,
          });
        }
      }

      if (result.success) {
        setExpenseData(updatedExpenseData);
        setExpense("");
        setCategory("");
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: result.error || "Failed to save expense. Please try again",
        });
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error saving expense. Please try again",
      });
    }
  };

  // Add custom category
  const handleAddCategory = () => {
    if (customCategory) {
      const newCategory = { name: customCategory, color: generateRandomColor() };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setCustomCategory("");
      categoryModalClose();
    }
  };

  // Delete specific expense
  const handleDeleteExpense = async (categoryToDelete) => {
    try {
      const expenseToDelete = expenseData.find((expense) => expense.category === categoryToDelete);

      if (!expenseToDelete || !expenseToDelete.id) {
        notifications.show({
          color: "red",
          title: "Cannot Delete Expense",
          message: "Expense not found in database",
        });
        return;
      }

      const response = await window.electron.ipcRenderer.invoke("delete-budget", expenseToDelete.id);

      if (response.success) {
        const updatedExpenseData = expenseData.filter((expense) => expense.category !== categoryToDelete);
        setExpenseData(updatedExpenseData);
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: response.error || "Failed to delete expense",
        });
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error deleting expense",
      });
    }
  };

  // Save all budget data to database
  const handleSaveBudget = async () => {
    if (parseFloat(income) <= 0) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please enter a valid income amount before saving",
      });
      return;
    }

    try {
      const budgetData = {
        income: parseFloat(income),
        expenses: expenseData,
        categories: categories,
      };

      const response = await window.electron.ipcRenderer.invoke("save-budget", budgetData);

      if (response.success) {
        if (response.id) {
          setBudgetId(response.id);
        }

        notifications.show({
          color: "green",
          message: "Budget Saved Successfully!",
        });

        fetchBudgets();
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: response.error || "Error saving budget. Please try again",
        });
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error saving budget. Please try again",
      });
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

  // Prepare data for charts (excluding "Income Left")
  const chartData = expenseData.map((item) => {
    const categoryInfo = categories.find((cat) => cat.name === item.category) || { name: item.category, color: "#999999" };
    return {
      name: item.category,
      value: item.expense,
      color: categoryInfo.color,
    };
  });

  return (
    <Container fluid style={{ backgroundColor: "white", padding: "20px" }}>
      <Grid>
        {/* Left Section: Controls */}
        <Grid.Col span={4}>
          <Card shadow="xs" padding="lg" style={{ backgroundColor: "#f8f9fa" }}>
            <Stack>
              <Title order={3} style={{ color: "#333" }}>Budget Controls</Title>

              {/* Update Income */}
              <Button onClick={updateIncomeModalOpen} style={{ backgroundColor: "#4caf50", color: "white" }}>
                Update Income
              </Button>

              {/* Add Expense */}
              <Button onClick={expenseModalOpen} style={{ backgroundColor: "#2196f3", color: "white" }}>
                Add Expense
              </Button>

              {/* Save Budget */}
              <Button fullWidth onClick={handleSaveBudget} style={{ backgroundColor: "#ff9800", color: "white" }}>
                {budgetId ? "Update Budget" : "Save Budget"}
              </Button>

              {incomeToExpenseRatio !== null ? (
                <>
                  <Title order={4} mt="md">Income to Expense Ratio: {incomeToExpenseRatio.toFixed(2)}%</Title>
                </>
              ) : (
                <Text>
                  {income > 0 ? "Add expenses to see the budget overview." : "Please enter your monthly income."}
                </Text>
              )}

              {/* Expense List */}
              <Stack spacing="xs" mt="md">
                {chartData.map((entry, index) => (
                  <Card key={index} padding="xs" shadow="sm" radius="md" style={{ backgroundColor: "#fff" }}>
                    <Grid align="center">
                      <Grid.Col span={6}>
                        <Group>
                          <ThemeIcon color={entry.color} radius="xl" />
                          <Text fw="bold" style={{ color: "#333" }}>{entry.name}</Text>
                        </Group>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Text fw={500} c="red.9">${entry.value.toFixed(2)}</Text>
                      </Grid.Col>
                      <Grid.Col span={3} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="subtle" color="red" size="xs" onClick={() => handleDeleteExpense(entry.name)}>
                          <IoIosClose size={20} />
                        </Button>
                      </Grid.Col>
                    </Grid>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right Section: Table and Charts */}
        <Grid.Col span={8}>
          <Card shadow="xs" padding="lg" style={{ backgroundColor: "#f8f9fa" }}>
            <Stack>
              <Title order={3} style={{ color: "#333" }}>Budget Overview</Title>

              {/* Income Left as Text */}
              <Text size="lg" fw={500} style={{ color: incomeLeft >= 0 ? "green" : "red" }}>
                Income Left: ${incomeLeft.toFixed(2)}
              </Text>

              {/* Table */}
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Category</th>
                    <th style={{ textAlign: "left" }}>Amount</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((entry, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left" }}>
                        <Group>
                          <ThemeIcon color={entry.color} radius="xl" />
                          <Text fw="bold" style={{ color: "#333" }}>{entry.name}</Text>
                        </Group>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <Text fw={500} c="red.9">${entry.value.toFixed(2)}</Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Button variant="subtle" color="red" size="xs" onClick={() => handleDeleteExpense(entry.name)}>
                          <IoIosClose size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Toggle Charts Button */}
              <Button onClick={() => setShowCharts(!showCharts)} style={{ backgroundColor: "#9c27b0", color: "white" }}>
                {showCharts ? "Hide Charts" : "Show Charts"}
              </Button>

              {/* Charts */}
              {showCharts && (
                <Tabs defaultValue="pie">
                  <Tabs.List>
                    <Tabs.Tab value="pie">Pie Chart</Tabs.Tab>
                    <Tabs.Tab value="bar">Bar Chart</Tabs.Tab>
                    <Tabs.Tab value="line">Line Chart</Tabs.Tab> {/* Re-added Line Chart */}
                  </Tabs.List>

                  <Tabs.Panel value="pie">
                    <PieChart
                      size={400}
                      pieProps={{ opacity: 0.7 }}
                      withLabelsLine
                      labelsPosition="outside"
                      labelsType="percent"
                      withLabels
                      data={chartData}
                      withTooltip
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="bar">
                    <BarChart
                      h={400}
                      data={chartData}
                      dataKey="name"
                      series={[{ name: "value", color: "black" }]}
                      withYAxis
                      withXAxis
                      valueFormatter={(value) => "$" + new Intl.NumberFormat("en-US").format(value)}
                      withBarValueLabel
                      valueLabelProps={{ position: "inside", fill: "white" }}
                      tooltipAnimationDuration={200}
                      barLabelColor="dark.9"
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="line">
                    <LineChart
                      h={400}
                      data={chartData}
                      dataKey="name"
                      series={[{ name: "value", color: "blue" }]}
                      withYAxis
                      withXAxis
                      curveType="linear"
                      withTooltip
                      tooltipAnimationDuration={200}
                      strokeWidth={2}
                    />
                  </Tabs.Panel>
                </Tabs>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Modals */}
      <Modal centered opened={updateIncomeModalOpened} onClose={updateIncomeModalClose} title="Update Income">
        <Stack>
          <Text>Current income: <Text span inherit c="green">${income}</Text></Text>
          <NumberInput placeholder="Monthly Income" allowNegative={false} value={tempIncome} onChange={setTempIncome} prefix="$" />
          <Button fullWidth mt="md" onClick={() => { setIncome(tempIncome); updateIncomeModalClose(); }}>Done</Button>
        </Stack>
      </Modal>

      <Modal centered opened={expenseModalOpened} onClose={expenseModalClose} title="Add Expense">
        <Stack>
          <NumberInput placeholder="Expense Amount" value={expense} onChange={setExpense} prefix="$" />
          <Select placeholder="Select Category" value={category} onChange={setCategory} data={categories.map((item) => item.name)} />
          <Group justify="space-between">
            <Button onClick={categoryModalOpen}>Add Custom Category</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal centered opened={categoryModalOpened} onClose={categoryModalClose} title="Add Custom Category">
        <Input placeholder="Name of Custom Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
        <Button fullWidth mt="md" onClick={handleAddCategory}>Add</Button>
      </Modal>
    </Container>
  );
};

export default ExpenseTracker;