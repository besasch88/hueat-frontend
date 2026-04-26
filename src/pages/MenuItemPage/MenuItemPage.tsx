import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { menuItemService } from '@services/menuItemService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MenuItemComponent } from './MenuItemComponent';
import { MenuItemDeleteConfirmModalComponent } from './MenuItemDeleteConfirmModalComponent';
import { MenuItemEditModalComponent } from './MenuItemEditModalComponent';
import { MenuItemEmptyStateComponent } from './MenuItemEmptyStateComponent';
import { useModals } from './MenuItemModals';
import { MenuItemNewModalComponent } from './MenuItemNewModalComponent';

export function MenuItemPage() {
  const { menuCategoryId } = useParams();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuCategory, setMenuCategory] = useState<MenuCategory>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const onMenuItemClickHandler = (id: string) => {
    navigate(`/menu/items/${id}`, { replace: true });
  };

  const onMenuItemSwitchHandler = async (menuItem: MenuItem, checked: boolean) => {
    try {
      const data = await menuItemService.updateMenuItem({ id: menuItem.id, active: checked });
      setMenuItems((prev) => prev.map((item) => (item.id === data.item.id ? data.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshMenuItems = async () => {
    const data = await menuItemService.listMenuItems({ menuCategoryId: menuCategoryId! });
    setMenuItems(data.items);
  };

  const onMenuItemMoveUpHandler = async (menuItem: MenuItem) => {
    const index = menuItems.findIndex((i) => i.id === menuItem.id);
    if (index <= 0) return;
    try {
      await menuItemService.updateMenuItem({ id: menuItem.id, position: menuItems[index - 1].position });
      await refreshMenuItems();
    } catch (err) {
      console.error(err);
    }
  };

  const onMenuItemMoveDownHandler = async (menuItem: MenuItem) => {
    const index = menuItems.findIndex((i) => i.id === menuItem.id);
    if (index >= menuItems.length - 1) return;
    try {
      await menuItemService.updateMenuItem({ id: menuItem.id, position: menuItems[index + 1].position });
      await refreshMenuItems();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const categoryData = await menuCategoryService.getMenuCategory({ id: menuCategoryId! });
        setMenuCategory(categoryData.item);
        const menuItemsData = await menuItemService.listMenuItems({ menuCategoryId: menuCategoryId! });
        setMenuItems(menuItemsData.items);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          default:
            navigate('/internal-server-error', { replace: true });
            break;
        }
      } finally {
        setPageLoaded(true);
      }
    })();
  }, [navigate, menuCategoryId]);

  const canWriteMenu = auth.hasPermissionTo('write-menu');

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title="..." backLink="/menu/categories" />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && menuCategory && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={menuCategory.title} backLink="/menu/categories" />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {menuItems.map((menuItem, index) => (
                  <MenuItemComponent
                    key={`menu_item_${menuItem.id}`}
                    menuItem={menuItem}
                    canMoveUp={index !== 0}
                    canMoveDown={index !== menuItems.length - 1}
                    onClick={onMenuItemClickHandler}
                    onMenuItemUp={onMenuItemMoveUpHandler}
                    onMenuItemDown={onMenuItemMoveDownHandler}
                    onMenuItemUpdate={modals.editMenuItem.open}
                    onMenuItemDelete={modals.deleteMenuItem.open}
                    onSwitch={onMenuItemSwitchHandler}
                  />
                ))}
              </StackList>
              {menuItems.length === 0 && <MenuItemEmptyStateComponent />}
            </Grid.Col>
            <Affix
              p="md"
              position={{ bottom: 0 }}
              hidden={!canWriteMenu}
              ta="center"
              style={{ borderTop: '1px solid var(--aimm-bg-paper)', background: 'white' }}
            >
              <Button size="lg" onClick={modals.newMenuItem.open} leftSection={<IconCirclePlus size={28} />}>
                {t('menuAddItem')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
      <MenuItemNewModalComponent
        isOpen={modals.newMenuItem.isOpen}
        menuCategoryId={menuCategoryId!}
        onClose={modals.newMenuItem.close}
        onCreated={(menuItem) => {
          setMenuItems((prev) => [...prev, menuItem]);
          modals.newMenuItem.close();
        }}
      />
      <MenuItemEditModalComponent
        isOpen={modals.editMenuItem.isOpen}
        menuItem={modals.editMenuItem.menuItem}
        onClose={modals.editMenuItem.close}
        onUpdated={(menuItem) => {
          setMenuItems((prev) => prev.map((i) => (i.id === menuItem.id ? menuItem : i)));
          modals.editMenuItem.close();
        }}
      />
      <MenuItemDeleteConfirmModalComponent
        isOpen={modals.deleteMenuItem.isOpen}
        menuItem={modals.deleteMenuItem.menuItem}
        onClose={modals.deleteMenuItem.close}
        onDeleted={(id) => {
          setMenuItems((prev) => prev.filter((i) => i.id !== id));
          modals.deleteMenuItem.close();
        }}
      />
    </AuthGuard>
  );
}
