import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line  } from "recharts";

// Styled components for the table

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
  margin-top: 20px;
  color: red;
  font-size: 18px;
  font-weight: bold;
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

const ToggleButton = styled.button`
  background-color:rgb(0, 0, 0);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-right: 10px;

  &:hover {
    background-color: #2f6b24;
  }
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #cc0000;
  }
`;

const PieWrapper = styled.div`
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
    <MainContainer>
      <BudgetBox>
        {/* Left Section */}
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

        {/* Right Section */}
        <RightBox>
          <h2>Budget Overview</h2>
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
            <ToggleButton onClick={() => setShowChart(!showChart)}>
              {showChart ? "Hide Chart" : "Show Chart"}
            </ToggleButton>
            <DeleteButton onClick={handleDeleteRecent}>Delete Recent</DeleteButton>
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
              <PieWrapper>{renderChart()}</PieWrapper>
            </>
          )}
        </RightBox>
      </BudgetBox>
    </MainContainer>
  );
};

export default ExpenseTracker;