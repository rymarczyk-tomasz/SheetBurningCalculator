import { createContext } from "react";

/** Czy strona procesu jest aktualnie widoczna (ukryte strony zostają w pamięci, ale nie reagują na skróty). */
export const ProcessActiveContext = createContext(true);
