import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface Props {
  src: string;
  isRevealed: boolean;
  setRevealed: (x: boolean) => void;
}

const PlayCard = ({ src, setRevealed, isRevealed }: Props) => {
  function revealCard() {
    if (!isRevealed) {
      setRevealed(true);
    } else {
      // setRevealed(false);
      console.warn("can't reveal the already revealed card");
    }
  }

  return (
    <button
      className={clsx(
        isRevealed && "rotate-y-180",
        "transform-preserve-3d w-full h-full cursor-pointer relative transition-transform duration-1000 aspect-w-2 aspect-h-3 rounded-md shadow-xl",
        "outline-none focus:ring-2 ring-offset-2 ring-emerald-600"
      )}
      disabled={isRevealed}
      onClick={revealCard}
    >
      {!isRevealed ? (
        <div
          className={clsx(
            "absolute rounded-md w-full h-full  flex items-center justify-center bg-gradient-to-tr from-cool-gray-100 to-cool-gray-300"
          )}
        >
          <QuestionMarkCircleIcon className="h-10 w-10 text-gray-400" />
        </div>
      ) : (
        <Image
          src={src}
          alt=""
          layout="fill"
          objectFit="cover"
          className={clsx(
            isRevealed && "z-10",
            "absolute rounded-md w-full h-full bg-yellow-400 flex items-center justify-center rotate-y-180"
          )}
        />
      )}
    </button>
  );
};

export default PlayCard;
