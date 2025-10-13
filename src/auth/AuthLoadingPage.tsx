import { Box, CircularProgress, Typography } from "@mui/material";

export const AuthLoadingPage = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    gap={2}
  >
    <CircularProgress size={60} />
    <Typography variant="h6" color="textSecondary">
      Initializing authentication...
    </Typography>
  </Box>
);