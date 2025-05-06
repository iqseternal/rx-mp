import { ModalMode } from '@/constants';
import { useNormalState, useShallowReactive } from '@/libs/hooks';
import { Alert, App, Form, Input, Modal, Space, Typography, type ModalProps } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle } from 'react';
import { createExtensionApi } from '@/api/modules';
import type { GetExtensionListApiStruct } from '@/api/modules';
import { toBizErrorMsg } from '@/error/code';
import { toNil } from '@suey/pkg-utils';
import { useSyncNormalState } from '@/libs/hooks/useReactive';

import IconFont from '@/components/IconFont';

import * as validators from '@/libs/validators';

export interface ExtensionModalProps {
  extensionGroupId?: number;
  onSuccess: () => void;
}

export interface ExtensionModalInstance {
  open: (mode?: ModalMode, initData?: GetExtensionListApiStruct) => void;
  close: () => void;
}

export interface ExtensionModalFormRecord {
  extension_name: string;
  description?: string;
}

export const ExtensionModal = memo(forwardRef<ExtensionModalInstance, ExtensionModalProps>((props, ref) => {
  const { onSuccess, extensionGroupId } = props;

  const { message } = App.useApp();

  const [syncPropsState] = useSyncNormalState(() => ({
    onSuccess: onSuccess,
    extensionGroupId: extensionGroupId
  }))

  const [shallowAttrs] = useShallowReactive<ModalProps>(() => ({
    open: false,

  }))

  const [shallowStatus] = useShallowReactive(() => ({
    mode: ModalMode.Create as ModalMode,

    okLoading: false
  }))

  const [normalState] = useNormalState(() => ({
    extensionGroupRecord: void 0 as (GetExtensionListApiStruct | undefined)
  }))

  const [form] = Form.useForm<ExtensionModalFormRecord>();

  const createExtensionGroup = useCallback(async () => {
    if (!syncPropsState.extensionGroupId) {
      message.error(`无效扩展组`)
      return;
    }

    const data = form.getFieldsValue();
    shallowStatus.okLoading = true;
    const [err, res] = await toNil(createExtensionApi({
      extension_group_id: syncPropsState.extensionGroupId,
      extension_name: data.extension_name,
      description: data.description,
    }))

    if (err) {
      message.error(toBizErrorMsg(err.reason, `创建扩展 ${data.extension_name} 失败`));
      shallowStatus.okLoading = false;
      return;
    }

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
        className='mb-2'
        message={(
          <div>
            Message
          </div>
        )}
      />

      <Form
        form={form}
        labelCol={{ span: 4 }}
      >
        <Form.Item
          label='扩展名称'
          required
        >
          <div
            className='w-full flex justify-end items-center flex-nowrap gap-x-1'
          >
            <Form.Item
              name='extension_name'
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

            <Typography.Text
              className='flex-none text-sm text-gray-500'
            >
              64字符
            </Typography.Text>
          </div>
        </Form.Item>

        <Form.Item
          label='描述'
        >
          <div className='w-full flex justify-end items-center flex-nowrap gap-x-1'>
            <Form.Item
              name='description'
              rules={[
                {
                  async validator(rule, value, callback) {
                    if (validators.isString(value)) {
                      if (!validators.isMaxLengthString(value, 255)) return Promise.reject(`扩展描述长度大于255字符`);
                    }
                  },
                }
              ]}
              noStyle
            >
              <Input.TextArea
                placeholder='请输入扩展描述'
                maxLength={255}
                allowClear
                rows={3}
              />
            </Form.Item>

            <Typography.Text
              className='flex-none text-sm text-gray-500'
            >
              255字符
            </Typography.Text>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}))
