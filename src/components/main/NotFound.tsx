import { Box, Typography } from "@mui/material";

export const NotFound = () => {
  return (
    <Box
      height="calc(100vh - 66px)"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4">Page not found.</Typography>
    </Box>
  );
};
