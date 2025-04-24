
import { invoker } from '@/libs/bus';
import { useTokensStore } from '@/stores';

invoker.handle('rx-data-getter-store:access-token', async () => useTokensStore.getAccessToken())

invoker.handle('rx-data-getter-store:refresh-token', async () => useTokensStore.getRefreshToken())
