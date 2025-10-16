import { DataProvider } from "react-admin";
import { dataProvider as customDataProvider } from "./dataProvider/index";

export const dataProvider: DataProvider = customDataProvider;
