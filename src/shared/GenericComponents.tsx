import { Avatar, Box } from "@mui/material";
import { IGenericAvatarProps } from "./interface";

export const GenericAvatar = ({
  isLeft,
  animate,
  src,
  alt,
}: IGenericAvatarProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 1s ease-in-out",
        transform: isLeft
          ? {
              xs: animate ? "translate(-50%, -250%)" : "translate(-50%, -100%)",
              md: animate ? "translate(-600%, -50%)" : "translate(-100%, -50%)",
            }
          : {
              xs: animate ? "translate(-50%, 150%)" : "translate(-50%, 0%)",
              md: animate ? "translate(600%, -50%)" : "translate(0%, -50%)",
            },
      }}
    >
      <Avatar src={src} alt={alt} sx={{ width: 70, height: 70 }} />
    </Box>
  );
};
