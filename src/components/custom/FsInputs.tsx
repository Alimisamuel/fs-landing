import React from "react";
import { TextField } from "@mui/material";

const FsInput = ({ ...rest }) => {
  return (
    <TextField
      margin="dense"
      {...rest}
      slotProps={{
        input: {
          style: {
            borderRadius: "4px",
          
          },
        },
      }}
      type="text"
      fullWidth
    />
  );
};

export default FsInput;
