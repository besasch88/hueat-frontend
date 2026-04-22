import { useAuth } from '@context/AuthContext';
import { Box, Container, Image, Paper } from '@mantine/core';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './LoginPage.module.css';
import { LoginPageForm } from './LoginPageForm';

export function LoginPage() {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const effectRan = useRef(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Effects
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;
    (async () => {
      try {
        const refreshToken = auth.getRefreshToken();
        if (!refreshToken) {
          auth.logout();
          setPageLoaded(true);
          return;
        }
        const data = await authService.refreshToken({
          refreshToken,
        });
        auth.refresh(data.accessToken, data.refreshToken);
        navigate('/', { replace: true });
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed': {
            auth.logout();
            setPageLoaded(true);
            break;
          }
          default: {
            auth.logout();
            navigate('/internal-server-error', { replace: true });
            setPageLoaded(true);
            break;
          }
        }
      }
    })();
  }, [auth, t, navigate]);

  // Content
  return (
    pageLoaded && (
      <Box className={classes.root}>
        <Box className={classes.rootPattern}>
          <Container className={classes.boxLogin}>
            <Paper p={'lg'}>
              <Image src="/icon.svg" alt="Login Icon" className={classes.boxLogo} />

              <LoginPageForm />
            </Paper>
          </Container>
        </Box>
      </Box>
    )
  );
}
