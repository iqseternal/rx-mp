import { rxApiPost, rxApiGet, rxApiDelete, rxApiPut } from '../definition';

export interface GetExtensionGroupListApiPayload {
  extension_group_id?: number;
  ExtensionGroupName?: string;
}

export interface GetExtensionGroupListApiResponse {
  extension_group_id: number;
  extension_group_uuid: string;
  extension_group_name: string;
  description?: string;
  enabled: 0 | 1;
  status: {
    is_deleted?: boolean;
  }
  creator_id?: null | number;
  updater_id?: null | number;
  created_time: string;
  updated_time: string;
}

export const getExtensionGroupListApi = async (payload: GetExtensionGroupListApiPayload) => {
  return rxApiGet<null | GetExtensionGroupListApiResponse[]>('/api/v1/rx/ext/get_ext_group_list', {
    data: payload
  })
}
