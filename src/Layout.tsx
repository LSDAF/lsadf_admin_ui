import { AppBar, Layout as RALayout, TitlePortal } from "react-admin";
import { Box, Typography } from "@mui/material";

const CustomAppBar = () => (
  <AppBar>
    <TitlePortal />
    <Box flex="1" />
    <Typography variant="h6" color="inherit" sx={{ mr: 2 }}>
      LSADF Admin
    </Typography>
  </AppBar>
);

export const Layout = (props: any) => (
  <RALayout {...props} appBar={CustomAppBar} />
);
