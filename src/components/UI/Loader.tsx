import React from "react";
import {
  Modal,
  Box,
} from "@mui/material";

const style = {
  width: "fit-content",
    border: "none",
  position:'absolute',
  mt:0,
  left: "50%",
  top:"50%",
  transform: "translate(-50%, -50%)",
};


const Loader = ({label}:{label?:string}) => {
  const [open, ] = React.useState(true);

  return (

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="bg-[#ffffff8f] h-[108px] w-[128px] rounded-[8px] flex flex-col items-center justify-center">

         <span className="loader"></span>
         <p className="font-[500] text-sm mt-2">{label || "Verifying..."}</p>
          </div>
        </Box>
      </Modal>

  );
};

export default Loader;