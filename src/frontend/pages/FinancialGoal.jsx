import React, { useState } from "react";
import { Container, Card, Title, Grid, Input, Checkbox, Button, Text, Select, Stack, NumberInput } from '@mantine/core';
import { notifications } from "@mantine/notifications";

function FinancialGoal() {
  const { ipcRenderer } = window.electron;

  // **State Hooks for Form Fields**
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState("");

  const validate = () => {
    let newErrors = {};
    if (!goalName) newErrors.goalName = "Goal name is required.";
    if (!targetAmount || parseFloat(targetAmount) <= 0) newErrors.targetAmount = "Target amount must be greater than 0.";
    if (!category) {
      newErrors.category = "Category is required.";
    } else if (category === "custom" && !customCategory) {
      newErrors.customCategory = "Custom category is required.";
    }
    if (recurring) {
      if (!incomeAmount || parseFloat(incomeAmount) <= 0) newErrors.incomeAmount = "Income amount is required and must be positive.";
      if (!frequency) newErrors.frequency = "Frequency is required.";
    }
    if (!targetDate) {
      newErrors.targetDate = "Target date is required.";
    } else if (new Date(targetDate) < new Date()) {
      newErrors.targetDate = "Target date cannot be in the past.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // **Save Goal Function**
  const saveGoal = async () => {
    if (!validate()) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Please fix the input errors to save your goal',
      })
      return;
    }

    const goalCategory = customCategory ? customCategory : category;

    const goalData = {
      name: goalName,
      targetAmount: parseFloat(targetAmount) || 0,
      category: goalCategory,
      recurring,
      incomeAmount: recurring ? parseFloat(incomeAmount) || 0 : null,
      frequency: recurring ? frequency : null,
      targetDate,
    };

    try {
      const response = await ipcRenderer.invoke("create-goal", goalData);
      if (response.error) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: response.error,
        })
      } else {
        notifications.show({
          color: 'green',
          title: 'Success',
          message: "Goal saved successfully!",
        })

        // Reset form after success
        setGoalName("");
        setTargetAmount("");
        setCategory("");
        setRecurring(false);
        setIncomeAmount("");
        setFrequency("");
        setTargetDate("");
      }

    } catch (error) {
      console.error("Error saving goal:", error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: "An error occurred while saving the goal.",
      })
    }
  };

  return (
    <Container size="xl">
      <Card bg="green.4">
        <Title order={3}>Create New Financial Goal</Title>

        <Grid mt="md" mb="md" gutter="lg">
          {/* First Column */}
          <Grid.Col component={Stack} span={4}>
            {errors.goalName && <Text c="red" size="sm" align="center">{errors.goalName}</Text>}
            <Input
              type="text"
              placeholder="Goal Name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
            {errors.targetAmount && <Text c="red" size="sm" align="center">{errors.targetAmount}</Text>}
            <NumberInput
              type="number"
              placeholder="Target Amount"
              value={targetAmount}
              onChange={setTargetAmount}
            />
            {errors.category && <Text c="red" size="sm" align="center">{errors.category}</Text>}
            <Select
              value={category}
              onChange={setCategory}
              placeholder="Select Category"
              data={[
                { value: "savings", label: "Savings" },
                { value: "investment", label: "Investment" },
                { value: "emergency", label: "Emergency Fund" },
                { value: "custom", label: "Custom" },
              ]}
            />
            {errors.customCategory && <Text color="red" size="sm" align="center">{errors.customCategory}</Text>}
            {category === "custom" && (
              <Input
                type="text"
                placeholder="Enter Custom Category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </Grid.Col>

          {/* Second Column */}
          <Grid.Col component={Stack} span={4}>
            <Checkbox
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              label="Enable Automatic Recurring Contributions"
            />
            {recurring && errors.incomeAmount && <Text color="red" size="sm" align="center">{errors.incomeAmount}</Text>}
            <Input
              type="number"
              placeholder="Amount of Income"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              disabled={!recurring}
            />
            {recurring && errors.frequency && <Text color="red" size="sm" align="center">{errors.frequency}</Text>}
            <Select
              value={frequency}
              onChange={setFrequency}
              placeholder="Select Frequency"
              disabled={!recurring}
              data={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
              ]}
            />
          </Grid.Col>

          {/* Third Column */}
          <Grid.Col component={Stack} span={4}>
            {errors.targetDate && <Text color="red" size="sm" align="center">{errors.targetDate}</Text>}
            <Text size="sm" align="center">Target Date</Text>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </Grid.Col>
        </Grid>

        {/* Button Section */}
        <Button onClick={saveGoal} fullWidth>Save New Goal</Button>
      </Card>
    </Container>
  );
}

export default FinancialGoal;
