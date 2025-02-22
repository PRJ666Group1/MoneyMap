import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import styled from "styled-components";
import dollarImg from "../assets/images/dollar.svg"; // Importing the SVG as a source
import {
  Container,
  Card,
  Table,
  Stack,
  Group,
  Button,
  Autocomplete,
  Modal,
  Combobox,
  useCombobox,
  Input,
  InputBase,
  NumberInput,
  Text
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

// LogTransactions Component
const LogTransactions = () => {
  const { ipcRenderer } = window.electron;

  //Actual data from the backend
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Modal values
  const [companyName, setCompanyName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");

  //Modal
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  //Status combobox
  const statusData = ["Pending", "Successful", "Failed"];
  const statusCombobox = useCombobox({
    onDropdownClose: () => statusCombobox.resetSelectedOption(),
  });
  const [statusValue, setStatusValue] = useState("");
  const statusOptions = statusData.map((status) => (
    <Combobox.Option key={status} value={status}>
      {status}
    </Combobox.Option>
  ));

  const fetchTransactions = async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke(
        "get-transactions"
      );
      console.log("Response from IPC:", response); // Debugging

      // Ensure transactions is an array
      setTransactions(
        Array.isArray(response.transactions) ? response.transactions : []
      );
    } catch (err) {
      setError("Failed to fetch transactions.");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  //Fetch transactions from the backend (IPC)
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Save transaction to the database
  const saveTransaction = async (transactionData) => {
    try {
      const response = await ipcRenderer.invoke(
        "create-transaction",
        transactionData
      );
      if (response.error) {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("An error occurred while saving the transaction.");
    }
  };

  // Reset all values to their initial state after the modal closes
  const resetModalValues = () => {
    setCompanyName("");
    setAmount(0);
    setDate("");
    setStatusValue("");
  };

  // Handle adding a new transaction
  const handleAddTransaction = (companyName, date, status, amount) => {
    const formattedDate = new Date(date).toLocaleDateString("en-CA"); // Format to "DD-MM-YYYY"

    const newTransaction = {
      companyName,
      date: formattedDate,
      status,
      amount,
    };

    saveTransaction(newTransaction); // Save the transaction to the database

    fetchTransactions(); // Fetch the updated list of transactions from the backend
    //setTestElements((prevElements) => [...prevElements, newTransaction]); // Add new transaction to the list
  };

  return (
    <Container size="xl">
      <Card bg="green.4">
        <Stack>
          <Group justify="space-between">
            <Group>
              <Autocomplete placeholder="Search"></Autocomplete>
              <Button color="green">Action</Button>
              <Button color="green">Filter</Button>
            </Group>
            <Group>
              <Button color="green" onClick={openModal}>
                + Add New Transaction
              </Button>
            </Group>
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Text fw="bold" span>ID.</Text></Table.Th>
                <Table.Th><Text fw="bold" span>Company Name</Text></Table.Th>
                <Table.Th><Text fw="bold" span>Date</Text></Table.Th>
                <Table.Th> <Text fw="bold" span>Status</Text></Table.Th>
                <Table.Th><Text fw="bold" span>Amount</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transactions.map((transaction, index) => (
                <Table.Tr key={index}>
                  <Table.Td><Text span>{index + 1}</Text></Table.Td>
                  <Table.Td><Text span>{transaction.dataValues.companyName}</Text></Table.Td>
                  <Table.Td><Text span>{transaction.dataValues.date}</Text></Table.Td>
                  <Table.Td><Text span>{transaction.dataValues.status}</Text></Table.Td>
                  <Table.Td><Text span>${transaction.dataValues.amount}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => {
          closeModal();
          resetModalValues();
        }}
        title="Add New Transaction Manually"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack align="center">
          <Autocomplete
            w="100%"
            placeholder="Company Name"
            value={companyName}
            onChange={setCompanyName}
          />
          <DatePicker placeholder="Date" value={date} onChange={setDate} />
          <Combobox
            store={statusCombobox}
            onOptionSubmit={(val) => {
              setStatusValue(val);
              statusCombobox.closeDropdown();
            }}
            w="100%"
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents="none"
                onClick={() => statusCombobox.toggleDropdown()}
              >
                {statusValue || <Input.Placeholder>Status</Input.Placeholder>}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{statusOptions}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <NumberInput
            w="100%"
            placeholder="Amount"
            prefix="$"
            value={amount}
            onChange={setAmount}
          />
          <Button
            color="green"
            onClick={() => {
              handleAddTransaction(
                companyName,
                date.toString(),
                statusValue,
                amount
              );
              closeModal(); // Close the modal after saving
            }}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default LogTransactions;