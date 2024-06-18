import React from 'react';
import { useLocation } from 'react-router-dom';

// import { i18n } from '~/core/languages';
import { Box, Button, Stack, Text, TextOverflow } from '~/design-system';
import { triggerToast } from '~/entries/popup/components/Toast/Toast';
import { QRCode } from '~/entries/popup/pages/qrcode/qrcode';

export const PointsQRSheet = () => {
  const { state } = useLocation();
  const referalLink: string = state.referalLink;
  console.log(referalLink);
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(referalLink as string);
    triggerToast({
      title: 'Link copied!',
      description: referalLink,
    });
  }, [referalLink]);

  return (
    <Box
      display="flex"
      width="full"
      alignItems="center"
      justifyContent="center"
    >
      <Stack space="8px">
        <Box paddingHorizontal="20px" paddingTop="20px">
          <QRCode size={280} value={referalLink as string} />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <TextOverflow
            color="label"
            size={'20pt'}
            weight="heavy"
            testId="account-name"
          >
            Referal Link:{' '}
          </TextOverflow>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Text color={'labelTertiary'} size="16pt" weight="bold">
            {referalLink}
          </Text>
        </Box>
        <Box
          paddingTop="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            color="surfaceSecondaryElevated"
            symbol="square.on.square"
            height="28px"
            variant="raised"
            onClick={handleCopy}
            tabIndex={0}
          >
            {'Copy Referral Link'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
