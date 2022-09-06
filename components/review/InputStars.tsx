/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

interface InputStarsProps {
  initialStars?: boolean[];
  setRating: Dispatch<SetStateAction<number>>;
}

export const InputStars: React.FC<InputStarsProps> = ({
  initialStars = [false, false, false, false, false],
  setRating,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [stars, setStars] = useState(initialStars);
  const [hover, setHover] = useState([false, false, false, false, false]);

  console.log(initialStars);
  console.log(stars);

  useEffect(() => {
    setRating(stars.filter(Boolean).length);
  }, [stars]);

  const onMouseHover = (event: MouseEvent<HTMLButtonElement>) => {
    const value = Number(event.currentTarget.value) - 1;
    setIsHovering(true);
    setHover(hover.map((_, i) => i <= value));
  };

  const onMouseExit = () => {
    setIsHovering(false);
  };

  const onStarClick = async (event: MouseEvent<HTMLButtonElement>) => {
    const value = Number(event.currentTarget.value) - 1;
    setStars(stars.map((_, i) => i <= value));
    // setRating(stars.filter(Boolean).length);
  };

  return (
    <>
      <b className="font-bold">Star rating</b>
      <div className="flex">
        {stars.map((_, index) => (
          <button
            type="button"
            key={index}
            aria-label={`stars of ${index + 1}`}
            value={index + 1}
            onMouseEnter={onMouseHover}
            onMouseLeave={onMouseExit}
            onClick={onStarClick}
          >
            {isHovering && hover[index] ? (
              <BsStarFill size="24px" />
            ) : !isHovering && stars[index] ? (
              <BsStarFill size="24px" />
            ) : (
              <BsStar size="24px" />
            )}
          </button>
        ))}
      </div>
    </>
  );
};
