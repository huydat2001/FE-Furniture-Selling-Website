import { createContext, useContext } from "react";

export const StylesContext = createContext(null);

export const useStylesContext = () => useContext(StylesContext);
