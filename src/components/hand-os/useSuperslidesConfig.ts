import {
  useEffect,
  useState,
} from 'react';

import { KeyUrlDeviceIO } from '/@/store';

import { useHashParam } from '@metapages/hash-query';

import { DemoMenuConfig } from './example-model';
import {
  MenuConfig,
  MenuModel,
} from './MenuModel';

/**
 * Get the Superslides config from the URL or supply a default
 * @returns superslides config object (there is a default)
 */
export const useSuperslidesConfig = () => {
  const [menuConfig, setMenuConfig] = useState<MenuConfig | undefined>(
    DemoMenuConfig
  );
  const [menuModel, setMenuModel] = useState<MenuModel | undefined>();

  const [channelKey] = useHashParam(
    KeyUrlDeviceIO,
    "superslides-output-visualization"
  );

  useEffect(() => {
    if (!channelKey || !menuConfig) {
      return;
    }
    const model = new MenuModel(menuConfig, channelKey);
    setMenuModel(model);
  }, [channelKey, menuConfig]);

  return { menuModel, config: menuConfig, channel: channelKey };
};
