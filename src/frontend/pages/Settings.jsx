import React, { useState} from "react";
import styled from "styled-components";



const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  

  &:hover {
    background-color: #45a049;
  }
`;

const Alert = styled.div`
  text-align: center;
  margin-top: 30px;
  color: red;
  font-size: 18px;
  font-weight: bold;
`;

const Settings = () => {
    const { ipcRenderer } = window.electron;
     const [alertMessage, setAlertMessage] = useState("");


  const handleExport = async () => {
    try {
      await ipcRenderer.invoke("export-json");
      setAlertMessage("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      setAlertMessage("Failed to export data.");
    }
  };

  return (
    <Container>
      <h2>Settings</h2>
      <Button onClick={handleExport}>Export Data to JSON</Button>
      {alertMessage && <Alert>{alertMessage}</Alert>}
    </Container>
  );
};

export default Settings;