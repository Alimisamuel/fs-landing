import { Backdrop, Box, Button, Fade, Modal } from "@mui/material";

import Image from "next/image";
import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "#000",
  border: "1px solid #181818",
  boxShadow: 24,
  p: 4,
};

const MoodCard = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setTimeout(() => {
      handleOpen();
    }, 3000);
  }, []);

  return (
    <>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="hide_scrollbar">
            <div className="flex flex-row justify-between items-center">
              <div></div>
              <div>
                <p className="text-center font-[700] text-lg">
                  Feeling a Certain Way?
                </p>
              </div>
              <div>
                <button
                  className="absolute z-50 top-4 right-6 text-white bg-[#181818] p-3 rounded-full"
                  onClick={handleClose}
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            </div>
            <p className="text-center text-xs">
              Pick your current mood and get content that connects deeper with
              your moment.
            </p>

            <div className="mx-auto w-[90%]">
              <div className=" mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                {MoodMock.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="flex flex-row items-center justify-center p-1 rounded-full w-[80px] h-[80px]">
                      <Image
                        src={item.src}
                        alt={item.mood}
                        width={100}
                        height={100}
                        className=""
                      />
                    </div>
                    <p className="text-center mt-1 font-bold">{item.mood}</p>
                    <p className="text-center text-xs w-[75%]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 mx-auto w-[70%] flex flex-row items-center gap-x-3">
                <Button
                  variant="contained"
                  sx={{ bgcolor: "white", color: "#000" }}
                  className="bg-white text-black"
                  onClick={handleClose}
                >
                  Remind me Later
                </Button>
                <Button
                sx={{flex:1, bgcolor:'#6d6d6eb2', color:'#fff'}}
         
                  onClick={handleClose}
                  startIcon={ <AiOutlineClose />}
                >
                  I don’t want to see this again
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default MoodCard;

const MoodMock = [
  {
    src: "/images/mood/1.svg",
    mood: "Happy",
    label: "I want something joyful and light",
  },
  {
    src: "/images/mood/2.svg",
    mood: "Sad",
    label: " I need comfort or encouragement",
  },
  {
    src: "/images/mood/3.svg",
    mood: "Angry",
    label: "I need something calming or grounding",
  },
  {
    src: "/images/mood/4.svg",
    mood: "Bored",
    label: "I Just want something fun to pass time",
  },
  {
    src: "/images/mood/5.svg",
    mood: "Bored",
    label: "I need hope or healing",
  },
  {
    src: "/images/mood/6.svg",
    mood: "Tired",
    label: "I need Something relaxing or slow-paced",
  },
];
