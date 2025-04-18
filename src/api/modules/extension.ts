import { asynced } from '@suey/pkg-utils';
import { rxApiPost, rxApiGet, rxApiDelete, rxApiPut } from '../definition';
import type { RApiPromiseLike } from '../definition';

export interface GetExtensionGroupListApiPayload {
  extension_group_id?: number;
  extension_group_name?: string;
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

export type GetExtensionGroupListApi = (payload: GetExtensionGroupListApiPayload) => RApiPromiseLike<GetExtensionGroupListApiResponse[], null>;

export const getExtensionGroupListApi = asynced<GetExtensionGroupListApi>(async (payload) => {
  return rxApiGet('/api/v1/rx/ext/get_ext_group_list', {
    data: payload
  })
})

export interface CreateExtensionGroupApiPayload {
  extension_group_name: string;
  description?: string;
}

export type CreateExtensionGroupApi = (payload: CreateExtensionGroupApiPayload) => RApiPromiseLike<null, null>;

export const createExtensionGroupApi = asynced<CreateExtensionGroupApi>(async (payload) => {
  return rxApiPut('/api/v1/rx/ext/ext_group', {
    data: payload
  })
})


export interface DeleteExtensionGroupApiPayload {
  extension_group_id: number;
  extension_group_uuid: string;
}

export type DeleteExtensionGroupApi = (payload: DeleteExtensionGroupApiPayload) => RApiPromiseLike<null>;

export const deleteExtensionGroupApi = asynced<DeleteExtensionGroupApi>(async (payload) => {
  return rxApiDelete('/api/v1/rx/ext/ext_group', {
    data: payload
  })
})



export interface EditExtensionGroupApiPayload {
  extension_group_id: number;
  extension_group_uuid: string;

  extension_group_name?: string;
  description?: string;
}

export type EditExtensionGroupApi = (payload: EditExtensionGroupApiPayload) => RApiPromiseLike<null, null>;

export const editExtensionGroupApi = asynced<EditExtensionGroupApi>(async (payload) => {
  return rxApiPost('/api/v1/rx/ext/ext_group', {
    data: payload
  })
})










export interface GetExtensionListApiPayload {
  extension_group_id?: number;
  extension_group_uuid?: string;
  extension_id?: number;
  extension_name?: string;
}

export interface GetExtensionListApiResponse {
  extension_id: number;
  extension_group_id: number;
  extension_uuid: string;
  extension_name: string;
  use_version?: null | number;
  script_hash?: null | string;
  metadata: Record<string, any>;
  status?: {
    is_deleted?: boolean;
  }
  creator_id?: null | number;
  updater_id?: null | number;
  created_time: string;
  updated_time: string;
}

export type GetExtensionListApi = (payload: GetExtensionListApiPayload) => RApiPromiseLike<GetExtensionListApiResponse[], null>;

export const getExtensionListApi = asynced<GetExtensionListApi>(async (payload) => {
  return rxApiGet('/api/v1/rx/ext/get_ext_list', {
    params: payload
  })
})



export interface CreateExtensionApiPayload {
  extension_group_id: number;
  extension_group_uuid?: string;

  extension_name: string;
}

export type CreateExtensionApi = (payload: CreateExtensionApiPayload) => RApiPromiseLike<null, null>;

export const createExtensionApi = asynced<CreateExtensionApi>(async (payload) => {
  return rxApiPut('/api/v1/rx/ext/ext', {
    data: payload
  })
})
