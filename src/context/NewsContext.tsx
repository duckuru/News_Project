import { createContext, type ReactNode, useState } from "react";

export const NewsContext = createContext(null);

export const NewsContextProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  return (
    <NewsContext.Provider value={{ news, setNews }}>
      {children}
    </NewsContext.Provider>
  );
};