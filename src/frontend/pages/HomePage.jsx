import React from 'react';
import { Container, Card, Flex, Title, Image, Text, Grid } from '@mantine/core';

import home1 from '/public/images/mm_home1.jpg';
import home2 from '/public/images/mm_home2.jpg';
import home3 from '/public/images/mm_home3.jpg';

const HomePage = () => {
  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <Card shadow="md" p="xl" bg="green.4" radius="md">
        <Flex direction="column" justify="center" align="center" gap="md">
          <Text fz={50}>MoneyMap</Text>
          <Text fw={500} size="lg" c="dark.6">Track, manage, and grow your finances effortlessly.</Text>
        </Flex>
      </Card>

      {/* Features Section */}
      <Grid mt="xl" gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card bg="green.4" shadow="sm" p="md" radius="md">
            <Image src={home1} alt="Feature 1" radius="md" />
            <Title order={3} mt="md">Smart Budgeting</Title>
            <Text size="sm" c="dark.6">Plan your expenses and save efficiently.</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card bg="green.4" shadow="sm" p="md" radius="md">
            <Image src={home2} alt="Feature 2" radius="md" />
            <Title order={3} mt="md">Expense Tracking</Title>
            <Text size="sm" c="dark.6">Monitor spending in real-time.</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card bg="green.4" shadow="sm" p="md" radius="md">
            <Image src={home3} alt="Feature 3" radius="md" />
            <Title order={3} mt="md">Financial Insights</Title>
            <Text size="sm" c="dark.6">Get detailed reports and analytics.</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default HomePage;
