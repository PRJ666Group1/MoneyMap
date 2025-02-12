import React from "react";
import styled from "styled-components";

// Main container (white, rounded)
const MainContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 20px auto;
`;

// Green container (rounded)
const Container = styled.div`
  background-color: #397d2c;
  border-radius: 15px;
  padding: 30px;
  color: white;
`;

// Centered title
const Title = styled.h3`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

// Container for the three columns
const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr; /* Increase the width of the second column */
  gap: 20px;
  margin-bottom: 20px;
`;

// Form components
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Inputs, dropdowns, and other fields styles
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
  align-items: center; /* Align checkbox and label on the same line */
`;

const Checkbox = styled.input`
  margin-right: 10px;
  transform: scale(1.5);
`;

const Label = styled.label`
  margin-left: 5px;
  font-size: 16px;
`;

// Button section
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

function FinancialGoal() {
  return (
    <MainContainer>
      <Container>
        <Title>Create new financial goal</Title>
        
        <FormContainer>
          {/* First Column */}
          <FormSection>
            <Input type="text" placeholder="Goal Name" />
            <Input type="number" placeholder="Target Amount" />
            <Select>
              <option value="">Select Category</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="emergency">Emergency Fund</option>
            </Select>
          </FormSection>

          {/* Second Column */}
          <FormSection>
            <CheckboxContainer>
              <Checkbox type="checkbox" />
              <Label>Enable Automatic Recurring Contributions</Label>
            </CheckboxContainer>
            <Input type="number" placeholder="Amount of Income" />
            <Select>
              <option value="">Select Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </Select>
          </FormSection>

          {/* Third Column */}
          <FormSection>
            <DateLabel htmlFor="target-date">Target Date</DateLabel>
            <Input id="target-date" type="date" />
          </FormSection>
        </FormContainer>

        {/* Button Section */}
        <ButtonContainer>
          <Button>Cancel</Button>
          <Button>Save New Goal</Button>
        </ButtonContainer>
      </Container>
    </MainContainer>
  );
}

export default FinancialGoal;
