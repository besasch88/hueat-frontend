import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MenuCategoryComponent } from './MenuCategoryComponent';
import { MenuCategoryDeleteConfirmModalComponent } from './MenuCategoryDeleteConfirmModalComponent';
import { MenuCategoryEditModalComponent } from './MenuCategoryEditModalComponent';
import { MenuCategoryEmptyStateComponent } from './MenuCategoryEmptyStateComponent';
import { useModals } from './MenuCategoryModals';
import { MenuCategoryNewModalComponent } from './MenuCategoryNewModalComponent';

export function MenuCategoryPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  const onMenuCategoryClickHandler = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  const onMenuCategorySwitchHandler = async (menuCategory: MenuCategory, checked: boolean) => {
    try {
      const data = await menuCategoryService.updateMenuCategory({ id: menuCategory.id, active: checked });
      setMenuCategories((prev) => prev.map((item) => (item.id === data.item.id ? data.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshMenuCategories = async () => {
    const data = await menuCategoryService.listMenuCategories();
    setMenuCategories(data.items);
  };

  const onMenuCategoryMoveUpHandler = async (menuCategory: MenuCategory) => {
    const index = menuCategories.findIndex((i) => i.id === menuCategory.id);
    if (index <= 0) return;
    try {
      await menuCategoryService.updateMenuCategory({
        id: menuCategory.id,
        position: menuCategories[index - 1].position,
      });
      await refreshMenuCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const onMenuCategoryMoveDownHandler = async (menuCategory: MenuCategory) => {
    const index = menuCategories.findIndex((i) => i.id === menuCategory.id);
    if (index >= menuCategories.length - 1) return;
    try {
      await menuCategoryService.updateMenuCategory({
        id: menuCategory.id,
        position: menuCategories[index + 1].position,
      });
      await refreshMenuCategories();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const menuCategoriesData = await menuCategoryService.listMenuCategories();
        setMenuCategories(menuCategoriesData.items);
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
  }, [navigate]);

  const canWriteMenu = auth.hasPermissionTo('write-menu');

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title={t('MenuCategory')} />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={t('MenuCategory')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {menuCategories.map((menuCategory, index) => (
                  <MenuCategoryComponent
                    key={`menu_category_${menuCategory.id}`}
                    menuCategory={menuCategory}
                    canMoveUp={index !== 0}
                    canMoveDown={index !== menuCategories.length - 1}
                    onClick={onMenuCategoryClickHandler}
                    onSwitch={onMenuCategorySwitchHandler}
                    onMenuCategoryUp={onMenuCategoryMoveUpHandler}
                    onMenuCategoryDown={onMenuCategoryMoveDownHandler}
                    onMenuCategoryUpdate={modals.editMenuCategory.open}
                    onMenuCategoryDelete={modals.deleteMenuCategory.open}
                  />
                ))}
              </StackList>
              {menuCategories.length === 0 && <MenuCategoryEmptyStateComponent />}
            </Grid.Col>
            <Affix
              p="md"
              position={{ bottom: 0 }}
              hidden={!canWriteMenu}
              ta="center"
              style={{ borderTop: '1px solid var(--aimm-bg-paper)', background: 'white' }}
            >
              <Button size="lg" onClick={modals.newMenuCategory.open} leftSection={<IconCirclePlus size={28} />}>
                {t('menuCategoryAddNew')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
      <MenuCategoryNewModalComponent
        isOpen={modals.newMenuCategory.isOpen}
        onClose={modals.newMenuCategory.close}
        onCreated={(menuCategory) => {
          setMenuCategories((prev) => [...prev, menuCategory]);
          modals.newMenuCategory.close();
        }}
      />
      <MenuCategoryEditModalComponent
        isOpen={modals.editMenuCategory.isOpen}
        menuCategory={modals.editMenuCategory.menuCategory}
        onClose={modals.editMenuCategory.close}
        onUpdated={(menuCategory) => {
          setMenuCategories((prev) => prev.map((i) => (i.id === menuCategory.id ? menuCategory : i)));
          modals.editMenuCategory.close();
        }}
      />
      <MenuCategoryDeleteConfirmModalComponent
        isOpen={modals.deleteMenuCategory.isOpen}
        menuCategory={modals.deleteMenuCategory.menuCategory}
        onClose={modals.deleteMenuCategory.close}
        onDeleted={(id) => {
          setMenuCategories((prev) => prev.filter((i) => i.id !== id));
          modals.deleteMenuCategory.close();
        }}
      />
    </AuthGuard>
  );
}
