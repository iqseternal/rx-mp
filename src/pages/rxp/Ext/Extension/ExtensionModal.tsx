import { ModalMode } from '@/constants';
import { useNormalState, useShallowReactive } from '@/libs/hooks';
import { Alert, App, Form, Input, Modal, Space, type ModalProps } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle } from 'react';
import type { GetExtensionListApiResponse } from '@/api/modules';
import { toBizErrorMsg } from '@/error/code';
import { toNil } from '@suey/pkg-utils';
import { useSyncNormalState } from '@/libs/hooks/useReactive';

import IconFont from '@/components/IconFont';

import * as validators from '@/libs/validators';

export interface ExtensionModalProps {
  onSuccess: () => void;
}

export interface ExtensionModalInstance {
  open: (mode?: ModalMode, initData?: GetExtensionListApiResponse) => void;
  close: () => void;
}

export interface ExtensionModalFormRecord {
  extension_name: string;
}

export const ExtensionModal = memo(forwardRef<ExtensionModalInstance, ExtensionModalProps>((props, ref) => {
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

  const [normalState] = useNormalState(() => ({
    extensionGroupRecord: void 0 as (GetExtensionListApiResponse | undefined)
  }))

  const [form] = Form.useForm<ExtensionModalFormRecord>();

  const createExtensionGroup = useCallback(async () => {
    const data = form.getFieldsValue();

    shallowStatus.okLoading = true;
    // const [err, res] = await toNil(createExtensionGroupApi({
    //   extension_group_name: data.extension_group_name,
    //   description: data.description
    // }))

    // if (err) {
    //   message.error(toBizErrorMsg(err.reason, `创建扩展 ${data.extension_group_name} 失败`));
    //   shallowStatus.okLoading = false;
    //   return;
    // }

    message.success(`创建扩展 ${data.extension_name} 成功`);
    shallowStatus.okLoading = false;
    shallowAttrs.open = false;
    syncPropsState.onSuccess?.();
  }, []);

  const editExtensionGroup = useCallback(async () => {
    const extensionGroupRecord = normalState.extensionGroupRecord;

    if (!extensionGroupRecord) {
      message.error(`记录不存在`);
      return;
    }

    const data = form.getFieldsValue();

    shallowStatus.okLoading = true;
    // const [err, res] = await toNil(editExtensionGroupApi({
    //   extension_group_id: extensionGroupRecord.extension_group_id,
    //   extension_group_uuid: extensionGroupRecord.extension_group_uuid,

    //   extension_group_name: data.extension_group_name,
    //   description: data.description,
    // }))

    // if (err) {
    //   message.error(toBizErrorMsg(err.reason, `编辑扩展 ${data.extension_group_name} 失败`));
    //   shallowStatus.okLoading = false;
    //   return;
    // }

    message.success(`编辑扩展 ${data.extension_name} 成功`);
    shallowStatus.okLoading = false;
    shallowAttrs.open = false;
    syncPropsState.onSuccess?.();
  }, []);

  const onOk = useCallback(async () => {
    const [validateErr] = await toNil(form.validateFields());
    if (validateErr) {
      message.warning(`请先完成本表单`);
      return;
    }

    if (shallowStatus.mode === ModalMode.Create) createExtensionGroup();
    if (shallowStatus.mode === ModalMode.Edit) editExtensionGroup();
  }, []);

  const onCancel = useCallback(async () => {
    shallowAttrs.open = false;
  }, []);

  const onClose = useCallback(async () => {
    shallowAttrs.open = false;
  }, []);

  useEffect(() => {
    if (shallowAttrs.open) return;

    if (shallowStatus.mode === ModalMode.Edit || shallowStatus.mode === ModalMode.View) {
      normalState.extensionGroupRecord = void 0;
      form.resetFields();
    }
  }, [shallowAttrs.open]);

  useImperativeHandle(ref, () => ({

    open: (mode, initData) => {
      shallowStatus.mode = mode ?? ModalMode.Create;

      if (mode === ModalMode.Create) {

      }

      if (mode === ModalMode.Edit) {
        normalState.extensionGroupRecord = initData;
        form.setFieldsValue(initData ?? {});
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
          扩展
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label='扩展名称'
          required
        >
          <Space
            align='center'
          >
            <Form.Item
              name='extension_group_name'
              tooltip='最大64字符'
              noStyle
              rules={[
                {
                  validator: async (rule, value) => {
                    if (!validators.isString(value) || validators.isEmptyString(value)) return Promise.reject(`请输入扩展名称`);
                    if (!validators.isMaxLengthString(value, 64)) return Promise.reject(`扩展名称长度大于64字符`);
                    if (!validators.isValidCharacterName(value)) return Promise.reject(`扩展名称不合法`);
                  }
                }
              ]}
            >
              <Input
                placeholder='请输入扩展名称'
                maxLength={64}
                allowClear
              />
            </Form.Item>

            <span>
              64字符
            </span>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}))
