import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  AppBar,
  UserMenu,
  Logout,
} from "react-admin";
import { Typography } from "@mui/material";

const CustomAppBar = () => (
  <AppBar>
    <Typography variant="h6" id="react-admin-title" sx={{ flex: 1 }}>
      LSADF Admin
    </Typography>
    <UserMenu>
      <Logout />
    </UserMenu>
  </AppBar>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout appBar={CustomAppBar}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
