import { useShallowReactive, useTransition } from '@/libs/hooks';
import { Alert, App, Button, Card, Form, Input, InputNumber, Space, Switch, Row } from 'antd';
import { memo, useCallback, useEffect, useRef } from 'react';
import { editExtensionGroupApi, getExtensionGroupListApi } from '@/api/modules';
import { GetExtensionGroupListApiStruct, deleteExtensionGroupApi } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import { toBizErrorMsg } from '@/error/code';
import { useSyncNormalState } from '@/libs/hooks/useReactive';

export const ExtensionGroupEnabledSwitch = memo(({ row, onSuccess }: { row: GetExtensionGroupListApiStruct; onSuccess: () => void; }) => {
  const { message, modal } = App.useApp();

  const [syncPropsState] = useSyncNormalState(() => ({
    onSuccess: onSuccess
  }))

  const [extensionGroupEnabledChanging, changeExtensionGroupEnabled] = useTransition(async () => {
    const enabled = row.enabled;

    const nextEnabled = enabled === 1 ? 0 : 1;
    const [err, res] = await toNil(editExtensionGroupApi({
      extension_group_id: row.extension_group_id,
      extension_group_uuid: row.extension_group_uuid,
      enabled: nextEnabled
    }))

    if (err) {
      message.error(toBizErrorMsg(err.reason, '扩展组切换启用状态失败'));
      return;
    }

    syncPropsState.onSuccess && syncPropsState.onSuccess();
  }, []);

  return (

    <Switch
      checked={row.enabled === 1}
      loading={extensionGroupEnabledChanging.pending}
      onClick={changeExtensionGroupEnabled}
    >

    </Switch>
  )
})
