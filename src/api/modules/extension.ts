import { asynced } from '@suey/pkg-utils';
import { rxApiPost, rxApiGet, rxApiDelete, rxApiPut } from '../definition';
import type { RXApiPromiseLike } from '../definition';

export interface GetExtensionGroupListApiPayload {
  extension_group_id?: number;
  extension_group_name?: string;

  page?: number;
  page_size?: number;
}

export interface GetExtensionGroupListApiStruct {
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

export interface GetExtensionGroupListApiResponse {
  list: GetExtensionGroupListApiStruct[];
  total: number;
}

export type GetExtensionGroupListApi = (payload: GetExtensionGroupListApiPayload) => RXApiPromiseLike<GetExtensionGroupListApiResponse, null>;

export const getExtensionGroupListApi = asynced<GetExtensionGroupListApi>(async (payload) => {
  return rxApiGet('/api/v1/rx/ext/get_ext_group_list', {
    params: payload
  })
})

export interface CreateExtensionGroupApiPayload {
  extension_group_name: string;
  description?: string;
}

export type CreateExtensionGroupApi = (payload: CreateExtensionGroupApiPayload) => RXApiPromiseLike<null, null>;

export const createExtensionGroupApi = asynced<CreateExtensionGroupApi>(async (payload) => {
  return rxApiPut('/api/v1/rx/ext/ext_group', {
    data: payload
  })
})

export interface DeleteExtensionGroupApiPayload {
  certificates: {
    extension_group_id: number;
    extension_group_uuid: string;
  }[]
}

export type DeleteExtensionGroupApi = (payload: DeleteExtensionGroupApiPayload) => RXApiPromiseLike<null>;

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

  enabled?: 0 | 1;
}

export type EditExtensionGroupApi = (payload: EditExtensionGroupApiPayload) => RXApiPromiseLike<null, null>;

export const editExtensionGroupApi = asynced<EditExtensionGroupApi>(async (payload) => {
  return rxApiPost('/api/v1/rx/ext/ext_group', {
    data: payload
  })
})

export interface GetExtensionListApiPayload {
  extension_group_id?: number;

  extension_id?: number;
  extension_uuid?: string;
  extension_name?: string;

  page?: number;
  page_size?: number;
}

export interface GetExtensionListApiStruct {
  extension_id: number;
  extension_group_id: number;
  extension_uuid: string;
  extension_name: string;
  use_version?: null | number;
  description?: string;
  script_hash?: null | string;
  metadata: Record<string, any>;
  status?: {
    is_deleted?: boolean;
  }
  enabled: 1 | 0;
  creator_id?: null | number;
  updater_id?: null | number;
  created_time: string;
  updated_time: string;
}

export interface GetExtensionListApiResponse {
  list: GetExtensionListApiStruct[];
  total: number;
}

export type GetExtensionListApi = (payload: GetExtensionListApiPayload) => RXApiPromiseLike<GetExtensionListApiResponse, null>;

export const getExtensionListApi = asynced<GetExtensionListApi>(async (payload) => {
  return rxApiGet('/api/v1/rx/ext/get_ext_list', {
    params: payload
  })
})


export interface CreateExtensionApiPayload {
  extension_group_id: number;
  extension_group_uuid?: string;

  extension_name: string;
  description?: string
}

export type CreateExtensionApi = (payload: CreateExtensionApiPayload) => RXApiPromiseLike<null, null>;

export const createExtensionApi = asynced<CreateExtensionApi>(async (payload) => {
  return rxApiPut('/api/v1/rx/ext/ext', {
    data: payload
  })
})

export interface EditExtensionApiPayload {
  extension_id: number;
  extension_uuid: string;
  enabled?: 0 | 1;
}

export type EditExtensionApi = (payload: EditExtensionApiPayload) => RXApiPromiseLike<null, null>;

export const editExtensionApi = asynced<EditExtensionApi>(async (payload) => {
  return rxApiPost('/api/v1/rx/ext/ext', {
    data: payload
  })
})

export interface DeleteExtensionApiPayload {
  extension_id: number;
  extension_uuid: string;
}

export type DeleteExtensionApi = (payload: DeleteExtensionApiPayload) => RXApiPromiseLike<null, null>;

export const deleteExtensionApi = asynced<DeleteExtensionApi>(async (payload) => {
  return rxApiDelete('/api/v1/rx/ext/ext', {
    data: payload
  })
})


export interface GetExtensionVersionListApiPayload {
  extension_id: number;
  extension_uuid: string;

  page?: number;
  page_size?: number;
}

export interface GetExtensionVersionListApiStruct {
  extension_version_id: number;
  extension_id: number;
  script_content?: string;
  version?: number;
  description?: string;
  creator_id?: null | number;
  updater_id?: null | number;
  created_time: string;
  updated_time: string;
}

export interface GetExtensionVersionListApiResponse {
  list: GetExtensionVersionListApiStruct[];
  total: number;
}

export type GetExtensionVersionListApi = (payload: GetExtensionVersionListApiPayload) => RXApiPromiseLike<GetExtensionVersionListApiResponse, null>;

export const getExtensionVersionListApi = asynced<GetExtensionVersionListApi>(async (payload) => {
  return rxApiGet('/api/v1/rx/ext/get_ext_version_list', {
    params: payload
  })
})


export interface CreateExtensionVersionApiPayload {
  extension_id: number;
  extension_uuid: string;

  script_content: string;
  description?: string;
}


export interface CreateExtensionVersionApiStruct {
  extension_version_id: number;
  extension_id: number;
  script_content: string;
  version: number;
  description?: string;

  creator_id: number;
  updater_id?: number;

  created_time?: number;
  updated_time?: number;
}

export type CreateExtensionVersionApiResponse = CreateExtensionVersionApiStruct;

export type CreateExtensionVersionApi = (payload: CreateExtensionVersionApiPayload) => RXApiPromiseLike<CreateExtensionVersionApiResponse, null>;

export const createExtensionVersionApi = asynced<CreateExtensionVersionApi>(async (payload) => {
  return rxApiPut('/api/v1/rx/ext/ext/version', {
    data: payload
  })
})




export interface ApplyExtensionVersionApiPayload {
  extension_id: number;
  extension_uuid: string;
  extension_version_id: number;
}

export type ApplyExtensionVersionApiResponse = null;

export type ApplyExtensionVersionApi = (payload: ApplyExtensionVersionApiPayload) => RXApiPromiseLike<ApplyExtensionVersionApiResponse, null>;

/**
 * 激活使用某个 version 版本
 */
export const applyExtensionVersionApi = asynced<ApplyExtensionVersionApi>((payload) => {
  return rxApiPost('/api/v1/rx/ext/apply_ext_version', {
    data: payload
  })
})
