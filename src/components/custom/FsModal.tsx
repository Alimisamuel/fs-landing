import React from 'react';
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { useSpring, animated } from "@react-spring/web";
import Image from "next/image";
import { IconButton } from "@mui/material";

interface FadeProps {
  children: React.ReactElement<{ onClick?: () => void }>;
  in?: boolean;
  onClick?: () => void;
  onEnter?: (node: HTMLElement | null, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement | null, isAppearing: boolean) => void;
  ownerState?: Record<string, unknown>;
}

interface CustomAlertModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?:string
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const {
    children,
    in: open = false,
    onClick,
    onEnter,
    onExited,
    ...other
  } = props;

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});



const FsModal: React.FC<CustomAlertModalProps> = ({
  open,
  onClose,
  children,
  width
}) => {
  const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: width || 400,
  borderRadius: "12px",
  boxShadow: 24,
  
};
  return (
  <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
       slotProps={{
    backdrop: {
      timeout: 500,
    },
  }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="flex flex-col items-center justify-center">
            
              {children}
            </div>
          </Box>
        </Fade>
      </Modal>
  )
}

export default FsModal
