import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";

export interface KeyCodeProps extends BoxProps {
  width?: string | number;
  height?: string | number;
}

export default function KeyCode({
  width = "32px",
  height = "32px",
  children,
  ...props
}: KeyCodeProps) {
  return (
    <Box
      sx={{
        width: width,
        height: height,
        backgroundColor: "#242926",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    >
      <Typography>{children}</Typography>
    </Box>
  );
}
