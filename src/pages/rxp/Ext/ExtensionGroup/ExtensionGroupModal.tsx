import { ModalMode } from '@/constants';
import { useNormalState, useShallowReactive } from '@/libs/hooks';
import { Alert, App, Form, Input, Modal, type ModalProps } from 'antd';
import { forwardRef, memo, useCallback, useImperativeHandle } from 'react';
import { createExtensionGroupApi, type GetExtensionGroupListApiResponse } from '@/api/modules';
import { toBizErrorMsg } from '@/error/code';
import { toNil } from '@suey/pkg-utils';

import IconFont from '@/components/IconFont';
import { useSyncNormalState } from '@/libs/hooks/useReactive';

export interface ExtensionGroupModalProps {
  onSuccess: () => void;
}

export interface ExtensionGroupModalInstance {
  open: (mode?: ModalMode) => void;
  close: () => void;
}

export interface ExtensionGroupModalFormRecord {
  extension_group_name: string;
  description: string;
}

export const ExtensionGroupModal = memo(forwardRef<ExtensionGroupModalInstance, ExtensionGroupModalProps>((props, ref) => {
  const { onSuccess } = props;

  const { message } = App.useApp();

  const [syncPropsState] = useSyncNormalState(() => ({
    onSuccess: onSuccess
  }))

  const [shallowAttrs] = useShallowReactive<ModalProps>(() => ({
    open: false,

  }))

  const [shallowStatus] = useShallowReactive(() => ({
    mode: ModalMode.Create as ModalMode,

    okLoading: false
  }))

  const [form] = Form.useForm<ExtensionGroupModalFormRecord>();

  const onOk = useCallback(async () => {
    const [validateErr] = await toNil(form.validateFields());
    if (validateErr) {
      message.warning(`请先完成本表单`);
      return;
    }

    const data = form.getFieldsValue();

    shallowStatus.okLoading = true;
    const [err, res] = await toNil(createExtensionGroupApi({
      extension_group_name: data.extension_group_name,
      description: data.description
    }))

    if (err) {
      message.error(toBizErrorMsg(err.reason, `创建扩展组 ${data.extension_group_name} 失败`));
      shallowStatus.okLoading = false;
      return;
    }

    message.success(`创建扩展组 ${data.extension_group_name} 成功`);
    shallowStatus.okLoading = false;
    shallowAttrs.open = false;
    syncPropsState.onSuccess?.();
  }, []);

  const onCancel = useCallback(async () => {
    shallowAttrs.open = false;
  }, []);

  const onClose = useCallback(async () => {
    shallowAttrs.open = false;
  }, []);

  useImperativeHandle(ref, () => ({

    open: (mode) => {
      shallowStatus.mode = mode ?? ModalMode.Create;

      if (mode === ModalMode.Create) {

      }

      shallowAttrs.open = true;
    },
    close: () => {

      shallowAttrs.open = false;
    }
  }), []);

  return (
    <Modal
      {...shallowAttrs}
      title={(
        <span>
          {shallowStatus.mode === ModalMode.Create && '创建'}
          {shallowStatus.mode === ModalMode.Edit && '编辑'}
          {shallowStatus.mode === ModalMode.View && '查看'}
          扩展组
        </span>
      )}
      okText='保存'
      okButtonProps={{
        type: 'primary',
        icon: <IconFont icon='SaveOutlined' />,
        loading: shallowStatus.okLoading
      }}
      cancelText='取消'
      cancelButtonProps={{
        type: 'default',
        icon: <IconFont icon='RollbackOutlined' />
      }}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onClose}
    >
      <Alert
        showIcon
        type='info'
        message={(
          <div>
            Message
          </div>
        )}
      />

      <Form
        form={form}
      >
        <Form.Item
          label='扩展组名称'
          required
          name='extension_group_name'
          rules={[
            {
              validator: async (rule, value, callback) => {

                // if (!value || !(typeof value === 'string')) return Promise.reject(`请输入扩展组名称`);

              },
            }
          ]}
        >
          <Input
            placeholder='请输入扩展组名称'
            maxLength={64}
            allowClear
          />
        </Form.Item>

        <Form.Item
          label='扩展组描述'
          name='description'
        >
          <Input.TextArea
            placeholder='请输入扩展组描述'
            maxLength={255}
            allowClear
            rows={3}
          />
        </Form.Item>

      </Form>
    </Modal>
  )
}))
