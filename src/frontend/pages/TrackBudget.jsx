import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// Styled components for the redesigned page
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5; /* Light gray background */
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #397d2c;
  margin-bottom: 15px;
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

const Table = styled.table`
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
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

const ChartSelector = styled.select`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
`;

const ExpenseTracker = () => {
  const [income, setIncome] = useState(localStorage.getItem("income") || "");
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState("");
  const [expenseData, setExpenseData] = useState(
    JSON.parse(localStorage.getItem("expenseData")) || []
  );
  const [showChart, setShowChart] = useState(false); // Toggle chart visibility
  const [chartType, setChartType] = useState("Pie"); // Chart type selector

  const categories = [
    { name: "Rent", color: "#FF6347" },
    { name: "Food", color: "#1E90FF" },
    { name: "Groceries", color: "#FFD700" },
    { name: "Utilities", color: "#8A2BE2" },
    { name: "Entertainment", color: "#FF4500" },
    { name: "Others", color: "#FF1493" },
  ];

  const handleAddExpense = () => {
    if (!income || !expense || !category) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      category,
      expense: parseFloat(expense),
      date: new Date().toLocaleDateString(), // Add date to expense
    };

    const updatedExpenseData = [...expenseData, newExpense];
    setExpenseData(updatedExpenseData);
    localStorage.setItem("expenseData", JSON.stringify(updatedExpenseData));

    setExpense("");
  };

  const handleDeleteRecent = () => {
    if (expenseData.length === 0) {
      alert("No expenses to delete!");
      return;
    }

    const updatedExpenseData = expenseData.slice(0, -1); // Remove the last item
    setExpenseData(updatedExpenseData);
    localStorage.setItem("expenseData", JSON.stringify(updatedExpenseData));
  };

  const data = [
    { name: "Income", value: income - expenseData.reduce((acc, curr) => acc + curr.expense, 0), color: "#32CD32" },
    ...categories.map((category) => ({
      name: category.name,
      value: expenseData
        .filter((e) => e.category === category.name)
        .reduce((acc, curr) => acc + curr.expense, 0),
      color: category.color,
    })),
  ];

  const renderChart = () => {
    if (chartType === "Pie") {
      return (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
    } else if (chartType === "Bar") {
      return (
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      );
    } else if (chartType === "Line") {
      return (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      );
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>Track Your Budget</HeaderTitle>
        <HeaderSubtitle>Manage your income and expenses effectively</HeaderSubtitle>
      </Header>

      <ContentGrid>
        {/* Left Section */}
        <Card>
          <CardTitle>Update Budget</CardTitle>
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
        </Card>

        {/* Right Section */}
        <Card>
          <CardTitle>Budget Overview</CardTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>Category</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.expense.toFixed(2)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <div>
            <Button onClick={() => setShowChart(!showChart)}>
              {showChart ? "Hide Chart" : "Show Chart"}
            </Button>
            <Button onClick={handleDeleteRecent} style={{ marginLeft: "10px", backgroundColor: "#ff4d4d" }}>
              Delete Recent
            </Button>
          </div>
          {showChart && (
            <>
              <ChartSelector
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="Pie">Pie Chart</option>
                <option value="Bar">Bar Chart</option>
                <option value="Line">Line Chart</option>
              </ChartSelector>
              <ChartWrapper>{renderChart()}</ChartWrapper>
            </>
          )}
        </Card>
      </ContentGrid>
    </PageContainer>
  );
};

export default ExpenseTracker;