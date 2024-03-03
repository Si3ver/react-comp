import React from "react";
import { SizeType } from "."

export interface ConfigContextType {
  space?: {
    size?: SizeType;
  }
}

export const ConfigContext = React.createContext<ConfigContextType>({});
