import React, { useState } from "react";
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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";

// LogTransactions Component
const LogTransactions = () => {
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

  const [companyName, setCompanyName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");

  //Table data for testing
  const [testElements, setTestElements] = useState([
    {
      no: 103,
      status: "Pending",
      date: "2025-02-10",
      companyName: "Alpha Corp",
      amount: "$100",
    },
    {
      no: 104,
      status: "Successful",
      date: "2025-02-09",
      companyName: "Beta Ltd",
      amount: "$300",
    },
    {
      no: 105,
      status: "Failed",
      date: "2025-02-08",
      companyName: "Gamma Inc",
      amount: "$200",
    },
    {
      no: 106,
      status: "Successful",
      date: "2025-02-07",
      companyName: "Delta Solutions",
      amount: "$500",
    },
    {
      no: 107,
      status: "Pending",
      date: "2025-02-06",
      companyName: "Omega Systems",
      amount: "$1000",
    },
  ]);

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
      no: testElements.length + 1, // Auto-increment based on the current length
      companyName,
      date: formattedDate,
      status,
      amount: `$${amount}`,
    };
    setTestElements((prevElements) => [...prevElements, newTransaction]); // Add new transaction to the list
  };

  // Test data for the table rows
  const testRows = testElements.map((element) => (
    <Table.Tr key={element.companyName}>
      <Table.Td>{element.no}</Table.Td>
      <Table.Td>{element.companyName}</Table.Td>
      <Table.Td>{element.date}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.amount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Card>
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
                <Table.Th>No.</Table.Th>
                <Table.Th>Company Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{testRows}</Table.Tbody>
          </Table>
        </Stack>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => {
          closeModal();
          resetModalValues();
        }}
        title="Add New Transaction"
      >
        <Stack>
          <Group justify="center">
            <Autocomplete
              placeholder="Company Name"
              value={companyName}
              onChange={setCompanyName}
            />
            <DatePicker placeholder="Date" value={date} onChange={setDate} />
          </Group>
          <Group justify="center">
            <Combobox
              store={statusCombobox}
              onOptionSubmit={(val) => {
                setStatusValue(val);
                statusCombobox.closeDropdown();
              }}
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
              placeholder="Amount"
              prefix="$"
              value={amount}
              onChange={setAmount}
            />
          </Group>
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
