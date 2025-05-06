import { useShallowReactive, useTransition } from '@/libs/hooks';
import { Alert, App, Button, Card, Form, Input, InputNumber, Space, Switch, Row } from 'antd';
import { memo, useCallback, useEffect, useRef } from 'react';
import { GetExtensionGroupListApiStruct, deleteExtensionGroupApi } from '@/api/modules';
import { toNil } from '@suey/pkg-utils';
import { toBizErrorMsg } from '@/error/code';
import { useSyncState } from '@/libs/hooks/useReactive';

import Widget from '@/components/Widget';
import IconFont from '@/components/IconFont';

export interface ExtensionGroupDeleteWidgetProps {
  row: GetExtensionGroupListApiStruct;
  onSuccess: () => void;
}

/**
 * 删除扩展组
 */
export const ExtensionGroupDeleteWidget = memo<ExtensionGroupDeleteWidgetProps>(({ row, onSuccess }) => {
  const { message, modal } = App.useApp();

  const [syncPropsState] = useSyncState(() => ({
    onSuccess: onSuccess
  }))

  const [extensionGroupDeleting, deleteExtensionGroup] = useTransition(async () => {
    const [err, res] = await toNil(deleteExtensionGroupApi({
      certificates: [
        {
          extension_group_id: row.extension_group_id,
          extension_group_uuid: row.extension_group_uuid
        }
      ]
    }));

    if (err) {
      message.error(toBizErrorMsg(err.reason, `删除扩展组 ${row.extension_group_name} 失败`));
      return;
    }

    syncPropsState.onSuccess && syncPropsState.onSuccess();
  }, []);

  return (
    <Widget
      icon='DeleteOutlined'
      className='text-red-500'
      tipText='删除扩展组'
      loading={extensionGroupDeleting.pending}
      onClick={async () => {
        modal.confirm({
          title: `是否确认删除扩展组 ${row.extension_group_name} ?`,
          okText: '删除',
          cancelText: '取消',
          okButtonProps: {
            icon: <IconFont icon='DeleteOutlined' />,
            type: 'primary',
            danger: true,
          },
          cancelButtonProps: {
            icon: <IconFont icon='RollbackOutlined' />,
            type: 'default'
          },
          onOk: deleteExtensionGroup,
          onCancel: () => {

          }
        })
      }}
    />
  )
})
