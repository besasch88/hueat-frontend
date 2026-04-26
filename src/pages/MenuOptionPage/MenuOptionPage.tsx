import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { menuItemService } from '@services/menuItemService';
import { menuOptionService } from '@services/menuOptionService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MenuOptionComponent } from './MenuOptionComponent';
import { MenuOptionDeleteConfirmModalComponent } from './MenuOptionDeleteConfirmModalComponent';
import { MenuOptionEditModalComponent } from './MenuOptionEditModalComponent';
import { MenuOptionEmptyStateComponent } from './MenuOptionEmptyStateComponent';
import { useModals } from './MenuOptionModals';
import { MenuOptionNewModalComponent } from './MenuOptionNewModalComponent';

export function MenuOptionPage() {
  const { menuItemId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const auth = useAuth();

  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem>();
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

  const onMenuOptionSwitchHandler = async (menuOption: MenuOption, checked: boolean) => {
    try {
      const data = await menuOptionService.updateMenuOption({ id: menuOption.id, active: checked });
      setMenuOptions((prev) => prev.map((item) => (item.id === data.item.id ? data.item : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshMenuOptions = async () => {
    const data = await menuOptionService.listMenuOptions({ menuItemId: menuItemId! });
    setMenuOptions(data.items);
  };

  const onMenuOptionMoveUpHandler = async (menuOption: MenuOption) => {
    const index = menuOptions.findIndex((i) => i.id === menuOption.id);
    if (index <= 0) return;
    try {
      await menuOptionService.updateMenuOption({ id: menuOption.id, position: menuOptions[index - 1].position });
      await refreshMenuOptions();
    } catch (err) {
      console.error(err);
    }
  };

  const onMenuOptionMoveDownHandler = async (menuOption: MenuOption) => {
    const index = menuOptions.findIndex((i) => i.id === menuOption.id);
    if (index >= menuOptions.length - 1) return;
    try {
      await menuOptionService.updateMenuOption({ id: menuOption.id, position: menuOptions[index + 1].position });
      await refreshMenuOptions();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const itemData = await menuItemService.getMenuItem({ id: menuItemId! });
        setMenuItem(itemData.item);
        const menuOptionsData = await menuOptionService.listMenuOptions({ menuItemId: menuItemId! });
        setMenuOptions(menuOptionsData.items);
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
  }, [navigate, menuItemId]);

  useEffect(() => {
    if (pageLoaded && location.state?.openNewModal) {
      modals.newMenuOption.open();
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoaded]);

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
        {pageLoaded && menuItem && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={menuItem.title} backLink={`/menu/categories/${menuItem.menuCategoryId}`} />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {menuOptions.map((menuOption, index) => (
                  <MenuOptionComponent
                    key={`menu_option_${menuOption.id}`}
                    menuItem={menuItem}
                    menuOption={menuOption}
                    canMoveUp={index !== 0}
                    canMoveDown={index !== menuOptions.length - 1}
                    onSwitch={onMenuOptionSwitchHandler}
                    onMenuOptionUp={onMenuOptionMoveUpHandler}
                    onMenuOptionDown={onMenuOptionMoveDownHandler}
                    onMenuOptionUpdate={modals.editMenuOption.open}
                    onMenuOptionDelete={modals.deleteMenuOption.open}
                  />
                ))}
              </StackList>
              {menuOptions.length === 0 && <MenuOptionEmptyStateComponent />}
            </Grid.Col>
            <Affix
              p="md"
              position={{ bottom: 0 }}
              hidden={!canWriteMenu}
              ta="center"
              style={{ borderTop: '1px solid var(--aimm-bg-paper)', background: 'white' }}
            >
              <Button size="lg" onClick={modals.newMenuOption.open} leftSection={<IconCirclePlus size={28} />}>
                {t('menuAddOption')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
      <MenuOptionNewModalComponent
        isOpen={modals.newMenuOption.isOpen}
        menuItemId={menuItemId!}
        onClose={modals.newMenuOption.close}
        onCreated={(menuOption) => {
          setMenuOptions((prev) => [...prev, menuOption]);
          modals.newMenuOption.close();
        }}
      />
      <MenuOptionEditModalComponent
        isOpen={modals.editMenuOption.isOpen}
        menuOption={modals.editMenuOption.menuOption}
        onClose={modals.editMenuOption.close}
        onUpdated={(menuOption) => {
          setMenuOptions((prev) => prev.map((i) => (i.id === menuOption.id ? menuOption : i)));
          modals.editMenuOption.close();
        }}
      />
      <MenuOptionDeleteConfirmModalComponent
        isOpen={modals.deleteMenuOption.isOpen}
        menuOption={modals.deleteMenuOption.menuOption}
        onClose={modals.deleteMenuOption.close}
        onDeleted={(id) => {
          setMenuOptions((prev) => prev.filter((i) => i.id !== id));
          modals.deleteMenuOption.close();
        }}
      />
    </AuthGuard>
  );
}
