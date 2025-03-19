import React, { useState, useEffect } from 'react';
import { Container, Card, Flex, Title, Image, Text, Grid, Progress, List, ThemeIcon } from '@mantine/core';
import { IconCheck, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import styled from 'styled-components';

import home1 from '/public/images/mm_home1.jpg';
import home2 from '/public/images/mm_home2.jpg';
import home3 from '/public/images/mm_home3.jpg';

// Styled components
const SectionTitle = styled(Title)`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
`;

const SectionSubTitle = styled(Text)`
  font-size: 1rem;
  color: #333;
  font-weight: bold;
`;

const SectionCard = styled(Card)`
  width: 100%;
  margin-bottom: 20px;
  padding: 20px;
`;

const BulletList = styled(List)`
  list-style-type: none;
  padding: 0;
`;




const HomePage = () => {

  // Dummy data for now
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API request (replace with real fetch later)
    setTimeout(() => {
      setData({
        financial_summary: {
          total_income: 5000,
          total_expenses: 3500,
          net_balance: 1500,
          spending_comparison: {
            "Groceries": { budgeted: 500, actual: 600, over_budget: true },
            "Entertainment": { budgeted: 200, actual: 150, over_budget: false },
            "Rent": { budgeted: 1200, actual: 1200, over_budget: false }
          }
        },
        recurring_expense_analysis: {
          recurring_expenses: {
            "Subscription": 15,
            "Gym Membership": 50
          },
          total_recurring_monthly: 65
        },
        financial_goals_analysis: {
          goals_progress: {
            "Emergency Fund": { targetAmount: 5000, timeLeft: 6, progress: 40 },
            "Vacation": { targetAmount: 2000, timeLeft: 3, progress: 60 }
          }
        },
        financial_recommendations: [
          "Consider reducing your grocery expenses.",
          "Your rent is stable, good job maintaining it!",
          "Save more towards your emergency fund."
        ]
      });
    }, 1000);
  }, []);

  if (!data) return <Text>Loading financial data...</Text>;

  
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




      {/* ---------------- AI Section ---------------*/}


      {/* Financial Summary section */}
      <SectionCard bg="green.4" mt="50px">
        <SectionTitle>Financial Summary</SectionTitle>
        <Text>Total Income: ${data.financial_summary.total_income}</Text>
        <Text>Total Expenses: ${data.financial_summary.total_expenses}</Text>
        <Text>Net Balance: ${data.financial_summary.net_balance}</Text>

          {/* conditional bold & red when over_budget spending  */}
        <SectionSubTitle size="md" mt="sm"> Spending Comparison </SectionSubTitle>
        {Object.entries(data.financial_summary.spending_comparison).map(([category, details]) => (
          <Flex key={category} gap="sm">
            <Text>{`> ${category}`}: </Text>
            <Text color={details.over_budget ? 'red.7' : 'black'} style={{ fontWeight: details.over_budget ? 'bold' : 'normal' }}>
                ${details.actual} / ${details.budgeted}
            </Text>
          </Flex>
        ))}
      </SectionCard>



      {/* Recurring Expense Analysis section*/}
      <SectionCard bg="green.4">
        <SectionTitle>Recurring Expenses</SectionTitle>
        <Text>Total Monthly Recurring: ${data.recurring_expense_analysis.total_recurring_monthly}</Text>
        {Object.entries(data.recurring_expense_analysis.recurring_expenses).map(([expense, cost]) => (
          <Text key={expense}> • {expense}: ${cost}</Text>
        ))}
      </SectionCard>



      {/* Financial Goals */}

          {/* Color of progressBar depends on % of progress */}
      <SectionCard bg="green.4">
        <SectionTitle>Financial Goals</SectionTitle>
        {Object.entries(data.financial_goals_analysis.goals_progress).map(([goal, details]) => (
          <Card key={goal} shadow="sm" radius="md" p="sm" mt="sm">
            <Text>{goal}</Text>
            <Text size="sm">Target: ${details.targetAmount} | Time Left: {details.timeLeft} months</Text>
            <Progress value={details.progress} size="lg" color={details.progress < 50 ? 'red.7' : 'green.8'} />
          </Card>
        ))}
      </SectionCard>

      {/* Financial Recommendations */}

          {/* to implement later: conditional icon rendering based on advice type */}
          {/* if congrats advice on wise financing, ThemeIcon color="green.8" & IconCheck*/}
          {/* if advice on fin mistakes, ThemeIcon color="red.8" & IconTrendingDown*/}
      <SectionCard bg="green.4">
        <SectionTitle>Financial Recommendations</SectionTitle>
        <BulletList spacing="xs" icon={<ThemeIcon color="green.8" size={24} radius="xl"><IconCheck size="1rem" /></ThemeIcon>}>
          {data.financial_recommendations.map((rec, index) => (
            <List.Item key={index}>{rec}</List.Item>
          ))}
        </BulletList>
          
        {/* Hardcoded Icon for Bad Advice (Trending Down) */}
        <hr></hr>
        <BulletList spacing="xs" icon={<ThemeIcon color="red.8" size={24} radius="xl"><IconTrendingDown size="1rem" /></ThemeIcon>}>
          <List.Item>
            You should review your spending habits on unnecessary subscriptions.
          </List.Item>
        </BulletList>
        {/* Hardcoded Icon for Bad Advice (Trending Down) */}

      </SectionCard>

    </Container>
  );
};  

export default HomePage;