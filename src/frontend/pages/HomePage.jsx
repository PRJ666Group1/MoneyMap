import React, { useState, useEffect } from 'react';
import { Container, Card, Flex, Title, Image, Text, Grid, Progress, List, ThemeIcon, Divider } from '@mantine/core';
import { IconCheck, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import styled from 'styled-components';

import home1 from '/public/images/mm_home1.jpg';
import home2 from '/public/images/mm_home2.jpg';
import home3 from '/public/images/mm_home3.jpg';

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff; /* Clean white background */
  padding: 30px;
  font-family: 'Montserrat', sans-serif;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #397d2c, #69db7c);
  color: white;
  text-align: center;
  padding: 50px 20px;
  border-radius: 20px;
  margin-bottom: 40px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const SectionCard = styled(Card)`
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const FeatureCard = styled(Card)`
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureImage = styled(Image)`
  border-radius: 10px;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #397d2c;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #555;
`;

const BulletList = styled(List)`
  list-style-type: none;
  padding: 0;
`;

const RecommendationItem = styled(List.Item)`
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
`;

const ProgressBar = styled(Progress)`
  margin-top: 10px;
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
    <AppContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>MoneyMap</HeroTitle>
        <HeroSubtitle>Track, manage, and grow your finances effortlessly.</HeroSubtitle>
      </HeroSection>

      {/* Features Section */}
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <FeatureCard>
            <FeatureImage src={home1} alt="Feature 1" />
            <FeatureTitle>Smart Budgeting</FeatureTitle>
            <FeatureDescription>Plan your expenses and save efficiently.</FeatureDescription>
          </FeatureCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <FeatureCard>
            <FeatureImage src={home2} alt="Feature 2" />
            <FeatureTitle>Expense Tracking</FeatureTitle>
            <FeatureDescription>Monitor spending in real-time.</FeatureDescription>
          </FeatureCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <FeatureCard>
            <FeatureImage src={home3} alt="Feature 3" />
            <FeatureTitle>Financial Insights</FeatureTitle>
            <FeatureDescription>Get detailed reports and analytics.</FeatureDescription>
          </FeatureCard>
        </Grid.Col>
      </Grid>

      {/* Financial Summary Section */}
      <SectionCard>
        <SectionTitle>Financial Summary</SectionTitle>
        <Text>Total Income: ${data.financial_summary.total_income}</Text>
        <Text>Total Expenses: ${data.financial_summary.total_expenses}</Text>
        <Text>Net Balance: ${data.financial_summary.net_balance}</Text>

        <Divider my="sm" />

        <SectionTitle>Spending Comparison</SectionTitle>
        {Object.entries(data.financial_summary.spending_comparison).map(([category, details]) => (
          <Flex key={category} justify="space-between" align="center" mb="sm">
            <Text>{category}</Text>
            <Text color={details.over_budget ? 'red' : 'green'}>
              ${details.actual} / ${details.budgeted}
            </Text>
          </Flex>
        ))}
      </SectionCard>

      {/* Recurring Expense Analysis Section */}
      <SectionCard>
        <SectionTitle>Recurring Expenses</SectionTitle>
        <Text>Total Monthly Recurring: ${data.recurring_expense_analysis.total_recurring_monthly}</Text>
        {Object.entries(data.recurring_expense_analysis.recurring_expenses).map(([expense, cost]) => (
          <Text key={expense}>• {expense}: ${cost}</Text>
        ))}
      </SectionCard>

      {/* Financial Goals Section */}
      <SectionCard>
        <SectionTitle>Financial Goals</SectionTitle>
        {Object.entries(data.financial_goals_analysis.goals_progress).map(([goal, details]) => (
          <Card key={goal} shadow="sm" radius="md" p="sm" mt="sm">
            <Text>{goal}</Text>
            <Text size="sm">Target: ${details.targetAmount} | Time Left: {details.timeLeft} months</Text>
            <ProgressBar value={details.progress} size="lg" color={details.progress < 50 ? 'red' : 'green'} />
          </Card>
        ))}
      </SectionCard>

      {/* Financial Recommendations Section */}
      <SectionCard>
        <SectionTitle>Financial Recommendations</SectionTitle>
        <BulletList>
          {data.financial_recommendations.map((rec, index) => (
            <RecommendationItem key={index}>
              <ThemeIcon color="green" size={24} radius="xl">
                <IconCheck size="1rem" />
              </ThemeIcon>
              {rec}
            </RecommendationItem>
          ))}
        </BulletList>
        {/* Hardcoded Icon for Bad Advice (Trending Down) */}
        <hr />
        <BulletList spacing="xs" icon={<ThemeIcon color="red.8" size={24} radius="xl"><IconTrendingDown size="1rem" /></ThemeIcon>}>
          <List.Item>
            You should review your spending habits on unnecessary subscriptions.
          </List.Item>
        </BulletList>
      </SectionCard>
    </AppContainer>
  );
};

export default HomePage;