import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getExtensionListApi } from '@/api/modules';
import type { GetExtensionListApi } from '@/api/modules';
import { asynced, toNil } from '@suey/pkg-utils';

import type { GetExtensionGroupListApiStruct, GetExtensionListApiStruct } from '@/api/modules';

export interface ExtensionStatusStore {
  selectedExtensionGroup?: GetExtensionGroupListApiStruct;
  selectedExtensionGroupLoading: boolean;

  selectedExtension?: GetExtensionListApiStruct;
  selectedExtensionLoading: boolean;
}

export const useExtensionStatusStore = create<ExtensionStatusStore>()(
  immer(
    (set, get, store) => ({

      selectedExtensionGroup: void 0,
      selectedExtensionGroupLoading: false,

      selectedExtension: void 0,
      selectedExtensionLoading: false
    })
  ),
);

export const updateSelectedExtensionInfo = (async () => {
  useExtensionStatusStore.setState({ selectedExtensionLoading: true });

  const oldExtension = useExtensionStatusStore.getState().selectedExtension;

  if (!oldExtension) {
    useExtensionStatusStore.setState({
      selectedExtension: void 0,
      selectedExtensionLoading: false
    });
    return;
  }

  const [err, res] = await toNil(getExtensionListApi({
    extension_id: oldExtension.extension_id,
    page_size: 1,
    page: 1
  }));

  if (err) {
    useExtensionStatusStore.setState({
      selectedExtension: void 0,
      selectedExtensionLoading: false
    });
    return;
  }

  const extension = res.data.list[0];

  if (!extension) {
    useExtensionStatusStore.setState({
      selectedExtension: void 0,
      selectedExtensionLoading: false
    });
    return;
  }

  useExtensionStatusStore.setState({
    selectedExtension: res.data.list[0],
    selectedExtensionLoading: false
  });
})
