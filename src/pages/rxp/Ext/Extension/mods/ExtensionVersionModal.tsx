import { ModalMode } from '@/constants';
import { useNormalState, useShallowReactive } from '@/libs/hooks';
import { Alert, App, Button, Form, Input, Modal, Space, Typography, Upload } from 'antd';
import type { ModalProps, UploadFile } from 'antd';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle } from 'react';
import { createExtensionApi, createExtensionVersionApi } from '@/api/modules';
import type { GetExtensionGroupListApiStruct, GetExtensionListApiStruct, GetExtensionVersionListApiStruct } from '@/api/modules';
import type { UploadChangeParam } from 'antd/es/upload';
import { toBizErrorMsg } from '@/error/code';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@uiw/react-codemirror';
import { toNil } from '@suey/pkg-utils';
import { useSyncState } from '@/libs/hooks/useReactive';

import ReactCodeMirror from '@uiw/react-codemirror';
import IconFont from '@/components/IconFont';
import Widget from '@/components/Widget';

import * as validators from '@/libs/validators';

export interface ExtensionVersionModalProps {
  extensionGroup?: GetExtensionGroupListApiStruct;
  extension?: GetExtensionListApiStruct;

  onSuccess: () => void;
}

export interface ExtensionVersionModalInstance {
  open: (mode?: ModalMode, initData?: GetExtensionVersionListApiStruct) => void;
  close: () => void;
}

export interface ExtensionVersionModalFormRecord {
  script_content?: string;
  description?: string;
}

export const ExtensionVersionModal = memo(forwardRef<ExtensionVersionModalInstance, ExtensionVersionModalProps>((props, ref) => {
  const { message } = App.useApp();

  const [syncPropsState] = useSyncState(() => ({
    onSuccess: props.onSuccess,
    extensionGroup: props.extensionGroup,
    extension: props.extension
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

  const [form] = Form.useForm<ExtensionVersionModalFormRecord>();

  /**
   * 创建迭代扩展版本
   */
  const createExtensionVersion = useCallback(async () => {
    if (!syncPropsState.extensionGroup) {
      message.error('无效扩展组');
      return;
    }

    if (!syncPropsState.extension) {
      message.error('无效扩展');
      return;
    }

    if (shallowStatus.okLoading) return;
    shallowStatus.okLoading = true;

    const [validateErr] = await toNil(form.validateFields());
    if (validateErr) {
      message.error('请先完成本表单');
      shallowStatus.okLoading = false;
      return;
    }

    const data = form.getFieldsValue();

    if (!data.script_content) {
      message.error('请输入扩展内容');
      shallowStatus.okLoading = false;
      return;
    }

    const [err, res] = await toNil(createExtensionVersionApi({
      extension_id: syncPropsState.extension.extension_id,
      extension_uuid: syncPropsState.extension.extension_uuid,

      script_content: data.script_content,
      description: data.description,
    }))

    if (err) {
      message.error(toBizErrorMsg(err.reason, `迭代扩展版本失败`));
      shallowStatus.okLoading = false;
      return;
    }

    message.success(`迭代扩展版本成功`);
    shallowStatus.okLoading = false;
    shallowAttrs.open = false;
    syncPropsState.onSuccess?.();
  }, []);


  const [shallowUploadState] = useShallowReactive(() => ({
    fileList: [] as UploadFile<string>[]
  }))

  /**
   * 上传脚本内容, 通过文件读取
   */
  const uploadScriptContent = useCallback(async (info: UploadChangeParam<UploadFile<string>>) => {
    const file = info.fileList?.[0].originFileObj;
    if (!file) return;

    const reader = new FileReader();

    reader.readAsArrayBuffer(file);


    let isRejected = false;

    return new Promise<void>((resolve, reject) => {
      reader.onerror = () => {
        isRejected = true;
        reject();
      }

      reader.onload = async (e) => {

        const content = e.target?.result;

        if (!content) {
          reject();
          return;
        }

        const text = new TextDecoder('utf-8').decode(content as ArrayBuffer);
        form.setFieldValue('script_content', text);
        resolve();
      }
    })


  }, []);


  const onOk = useCallback(async () => {
    if (shallowStatus.mode === ModalMode.Create) createExtensionVersion();
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
          {shallowStatus.mode === ModalMode.Create && '迭代'}
          {shallowStatus.mode === ModalMode.Edit && '编辑'}
          {shallowStatus.mode === ModalMode.View && '查看'}
          扩展版本
        </span>
      )}
      width={1100}
      okText='确认'
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
        labelCol={{ span: 3 }}
      >
        <Form.Item
          label='scriptContent'
          required
        >
          <div
            className='w-full flex justify-end items-start flex-nowrap gap-x-1'
          >
            <Form.Item
              name='script_content'
              noStyle
            >
              <ReactCodeMirror
                placeholder='请输入扩展内容'
                theme={vscodeDark}
                minHeight='144px'
                className='w-full h-full'
                basicSetup={{
                  lineNumbers: true,
                }}
                extensions={[
                  javascript(),
                  EditorView.lineWrapping
                ]}
              />
            </Form.Item>

            <Upload
              accept='.js'
              maxCount={1}
              fileList={shallowUploadState.fileList}
              onChange={uploadScriptContent}
            >
              <Widget
                icon='UploadOutlined'
                size='small'
              />
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          label='版本描述'
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
