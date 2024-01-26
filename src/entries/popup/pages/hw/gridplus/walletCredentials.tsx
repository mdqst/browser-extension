import { motion } from 'framer-motion';
import { setup } from 'gridplus-sdk';
import { FormEvent, useEffect, useState } from 'react';

import { i18n } from '~/core/languages';
import { Box, Button, Text } from '~/design-system';
import { Input } from '~/design-system/components/Input/Input';

export type WalletCredentialsProps = {
  appName: string;
  onAfterSetup?: (result: boolean) => void;
};

export const WalletCredentials = ({
  appName,
  onAfterSetup,
}: WalletCredentialsProps) => {
  const [connecting, setConnecting] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    password: '',
  });
  const getStoredClient = () => localStorage.getItem('storedClient') ?? '';

  const setStoredClient = (storedClient: string | null) => {
    if (!storedClient) return;
    localStorage.setItem('storedClient', storedClient);
  };
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConnecting(true);
    try {
      const result = await setup({
        deviceId: formData.deviceId,
        password: formData.password,
        name: appName,
        getStoredClient,
        setStoredClient,
      });
      onAfterSetup && onAfterSetup(result);
    } finally {
      setConnecting(false);
    }
  };
  useEffect(() => {
    if (getStoredClient()) {
      setup({ getStoredClient, setStoredClient, name: appName });
    }
  }, [appName]);
  return (
    <Box
      as={motion.form}
      display="flex"
      flexDirection="column"
      onSubmit={onSubmit}
      gap="16px"
      width="full"
    >
      <Text size="20pt" weight="semibold">
        {i18n.t('hw.connect_gridplus_title')}
      </Text>
      <Box as="fieldset" display="flex" flexDirection="column" gap="8px">
        <Text size="14pt" weight="semibold">
          {i18n.t('hw.gridplus_device_id')}
        </Text>
        <Input
          variant="bordered"
          height="40px"
          id="deviceId"
          placeholder="Enter Device ID"
          onChange={(e) =>
            setFormData({ ...formData, deviceId: e.target.value })
          }
          value={formData.deviceId}
          testId="gridplus-deviceid"
          aria-label="username"
        />
      </Box>
      <Box as="fieldset" display="flex" flexDirection="column" gap="8px">
        <Text size="14pt" weight="semibold">
          {i18n.t('hw.gridplus_password')}
        </Text>
        <Input
          variant="bordered"
          height="40px"
          id="password"
          type="password"
          placeholder="Enter Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          value={formData.password}
          testId="gridplus-password"
          aria-label="password"
        />
      </Box>
      <Button
        height="36px"
        variant="flat"
        color="fill"
        disabled={connecting}
        testId="gridplus-submit"
      >
        {i18n.t('hw.gridplus_connect')}
      </Button>
    </Box>
  );
};
