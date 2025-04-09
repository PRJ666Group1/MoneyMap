import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Flex,
  Title,
  Image,
  Text,
  Grid,
  Progress,
  List,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { IconCheck, IconTrendingDown } from "@tabler/icons-react";
import styled from "styled-components";

import home1 from "/public/images/mm_home1.jpg";
import home2 from "/public/images/mm_home2.jpg";
import home3 from "/public/images/mm_home3.jpg";

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #397d2c;
  padding: 30px;
  font-family: "Montserrat", sans-serif;
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
  const { ipcRenderer } = window.electron;
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const message = await ipcRenderer.invoke("export-json");
        
        const res = await fetch("https://moneymap.fadaei.dev/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer supersecret123",
          },
          body: JSON.stringify({ message: JSON.stringify(message.data) }),
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        if (isMounted) setData(json);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  if (!data) return <Text>Loading financial data...</Text>;

  return (
    <AppContainer>
      <HeroSection>
        <HeroTitle>MoneyMap</HeroTitle>
        <HeroSubtitle>
          Track, manage, and grow your finances effortlessly.
        </HeroSubtitle>
      </HeroSection>

      <SectionCard style={{ marginTop: "3rem" }}>
        <SectionTitle>Financial Summary</SectionTitle>
        <Text>Total Income: ${data.financial_summary.total_income}</Text>
        <Text>Total Expenses: ${data.financial_summary.total_expenses}</Text>
        <Text>Net Balance: ${data.financial_summary.net_balance}</Text>

        <Divider my="sm" />

        <SectionTitle>Spending Comparison</SectionTitle>
        {data.financial_summary.spending_comparison.map((item) => (
          <Flex
            key={item.category_name}
            justify="space-between"
            align="center"
            mb="sm"
          >
            <Text>{item.category_name}</Text>
            <Text color={item.over_budget ? "red" : "green"}>
              ${item.actual} / ${item.budgeted}
            </Text>
          </Flex>
        ))}
      </SectionCard>

      <SectionCard>
        <SectionTitle>Recurring Expenses</SectionTitle>
        <Text>
          Total Monthly Recurring: $
          {data.recurring_expense_analysis.total_recurring_monthly}
        </Text>
        {data.recurring_expense_analysis.recurring_expenses.map((item) => (
          <Text key={item.name}>
            • {item.name}: ${item.expense}
          </Text>
        ))}
      </SectionCard>

      <SectionCard>
        <SectionTitle>Financial Goals</SectionTitle>
        {data.financial_goals_analysis.goals_progress.map((goal) => (
          <Card key={goal.name} shadow="sm" radius="md" p="sm" mt="sm">
            <Text>{goal.name}</Text>
            <Text size="sm">
              Target: ${goal.targetAmount} | Time Left: {goal.timeLeft} months
            </Text>
            <ProgressBar
              value={goal.progress}
              size="lg"
              color={goal.progress < 50 ? "red" : "green"}
            />
          </Card>
        ))}
      </SectionCard>

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
        <hr />
        <BulletList
          spacing="xs"
          icon={
            <ThemeIcon color="red.8" size={24} radius="xl">
              <IconTrendingDown size="1rem" />
            </ThemeIcon>
          }
        >
          <List.Item>
            You should review your spending habits on unnecessary subscriptions.
          </List.Item>
        </BulletList>
      </SectionCard>
    </AppContainer>
  );
};

export default HomePage;
