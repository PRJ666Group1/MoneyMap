import React from 'react';

import { useState } from 'react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './LeftSideBar.module.css';

import { FaDollarSign } from '@react-icons/all-files/fa/FaDollarSign';
import { FaHome } from '@react-icons/all-files/fa/FaHome';
import { FaFileAlt } from '@react-icons/all-files/fa/FaFileAlt';
import { FaChartLine } from '@react-icons/all-files/fa/FaChartLine';
import { FaBullseye } from '@react-icons/all-files/fa/FaBullseye';
import { FaTachometerAlt } from '@react-icons/all-files/fa/FaTachometerAlt';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { Link } from 'react-router-dom';

function NavbarLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link to={to}>
        <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  );
}

const linkData = [
  { icon: FaHome, label: 'Home', to: '/main_window' },
  { icon: FaFileAlt, label: 'Log Transactions', to: 'log-transactions' }, // Represents document/logging
  { icon: FaChartLine, label: 'Track Budget, Income & Expenses', to: '/track-budget' }, // Represents financial tracking
  { icon: FaBullseye, label: 'Set Financial Goal', to: '/financial-goal' }, // Represents goal setting
  { icon: FaTachometerAlt, label: 'Financial Goal Dashboard', to: '/financial-goals-dashboard' }, // Represents dashboard/overview
  { icon: FaCog, label: 'Settings (In Development)' }, // Standard settings icon

];

export default function LeftSideBar() {
  const [active, setActive] = useState(2);

  const links = linkData.map((link, index) => (
    <NavbarLink
      {...link}
      to={link.to}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <FaDollarSign size={50} color="green" />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}