import { useAuth } from '@context/AuthContext';
import { Paper, ScrollArea } from '@mantine/core';
import {
  IconBasket,
  IconChartHistogram,
  IconColumns,
  IconDoorExit,
  IconLayout2,
  IconMapPin,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Navbar.module.css';
import { NavbarItem, NavbarItemProps } from './NavbarItem';

export function Navbar() {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [menuItems, setMenuItems] = useState<NavbarItemProps[]>([]);
  const [footerMenuItems, setFooterMenuItems] = useState<NavbarItemProps[]>([]);

  // Effects
  useEffect(() => {
    const items = [];
    if (auth.hasPermissionTo('read-my-tables') || auth.hasPermissionTo('read-other-tables')) {
      items.push({
        label: t('menuTables'),
        icon: IconLayout2,
        link: '/tables',
      });
    }
    if (auth.hasPermissionTo('read-takeaway')) {
      items.push({
        label: t('menuTakeaway'),
        icon: IconBasket,
        link: '/takeaway',
      });
    }
    if (auth.hasPermissionTo('read-menu')) {
      items.push({
        label: t('menuMenu'),
        icon: IconColumns,
        link: '/menu/categories',
      });
    }
    if (auth.hasPermissionTo('read-printer')) {
      items.push({
        label: t('menuPrinter'),
        icon: IconMapPin,
        link: '/printers',
      });
    }
    if (auth.hasPermissionTo('read-statistics')) {
      items.push({
        label: t('menuStatistics'),
        icon: IconChartHistogram,
        link: '/statistics',
      });
    }
    setMenuItems(items);
    setFooterMenuItems([{ label: t('menuLogout'), icon: IconDoorExit, link: '/logout' }]);
  }, [auth, t]);

  // Content
  const menuComponents = menuItems.map((item) => <NavbarItem {...item} key={item.label} />);
  const footerMenuComponents = footerMenuItems.map((item) => <NavbarItem {...item} key={item.label} />);

  return (
    <Paper className={classes.navbarBox} bg={''} p={'xs'}>
      <nav className={classes.navbar}>
        <ScrollArea className={classes.links}>
          <div>{menuComponents}</div>
        </ScrollArea>
        <div className={classes.footer}>{footerMenuComponents}</div>
      </nav>
    </Paper>
  );
}
