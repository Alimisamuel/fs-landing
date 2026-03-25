
"use client";

import { FC } from "react";

import PopUpCard from "@/components/cards/Popup";
import Modal from "@/components/Modals/Modal";
import { useCardContext } from "@/contexts/CardContext";
import { useMovieContext } from "@/contexts/MovieContext";

const MainContent: FC = () => {
  const { cardState } = useCardContext();
  const { selectedMovie, isModalOpen, setModalOpen } = useMovieContext();

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <PopUpCard
        isHovered={cardState.isHovered}
        x={cardState.postion?.x || 0}
        y={cardState.postion?.y || 0}
      />
      {selectedMovie && (
        <Modal
          movieData={selectedMovie}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default MainContent;
