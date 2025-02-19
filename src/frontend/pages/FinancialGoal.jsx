import React, { useState } from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 20px auto;
`;

const Container = styled.div`
  background-color: #397d2c;
  border-radius: 15px;
  padding: 30px;
  color: white;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  transform: scale(1.5);
`;

const Label = styled.label`
  margin-left: 5px;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #397d2c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px;
  font-size: 16px;
  border: 1px dotted white;

  &:hover {
    background-color: #2f6b24;
  }
`;

const DateLabel = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  text-align: center;
`;

const MessageContainer = styled.div`
  height: 30px; /* ✅ Reserve space so content doesn't shift */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.type === "success" ? "white" : "red")};
  visibility: ${(props) =>
    props.show ? "visible" : "hidden"}; /* ✅ Hide when empty */
`;

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
  const [message, setMessage] = useState(null);

  // **Save Goal Function**
  const saveGoal = async () => {
    const goalData = {
      name: goalName,
      targetAmount: parseFloat(targetAmount) || 0,
      category,
      recurring,
      incomeAmount: recurring ? parseFloat(incomeAmount) || 0 : null,
      frequency: recurring ? frequency : null,
      targetDate,
    };

    try {
      const response = await ipcRenderer.invoke("create-goal", goalData);
      if (response.error) {
        setMessage({ type: "error", text: `Error: ${response.error}` });
      } else {
        setMessage({ type: "success", text: "Goal saved successfully!" });

        // Reset form after success
        setGoalName("");
        setTargetAmount("");
        setCategory("");
        setRecurring(false);
        setIncomeAmount("");
        setFrequency("");
        setTargetDate("");
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving goal:", error);
      setMessage({
        type: "error",
        text: "An error occurred while saving the goal.",
      });
    }
  };

  return (
    <MainContainer>
      <Container>
        <Title>Create new financial goal</Title>

        <FormContainer>
          {/* First Column */}
          <FormSection>
            <Input
              type="text"
              placeholder="Goal Name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Target Amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="emergency">Emergency Fund</option>
            </Select>
          </FormSection>

          {/* Second Column */}
          <FormSection>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              <Label>Enable Automatic Recurring Contributions</Label>
            </CheckboxContainer>
            <Input
              type="number"
              placeholder="Amount of Income"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              disabled={!recurring}
            />
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={!recurring}
            >
              <option value="">Select Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </Select>
          </FormSection>

          {/* Third Column */}
          <FormSection>
            <DateLabel htmlFor="target-date">Target Date</DateLabel>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </FormSection>
        </FormContainer>
        <MessageContainer type={message?.type} show={!!message}>
          {message?.text}
        </MessageContainer>
        {/* Button Section */}
        <ButtonContainer>
          <Button onClick={saveGoal}>Save New Goal</Button>
        </ButtonContainer>
      </Container>
    </MainContainer>
  );
}

export default FinancialGoal;
