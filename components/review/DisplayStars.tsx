/* eslint-disable react/no-array-index-key */
import React from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

interface DisplayStarsProps {
  rating: number | undefined;
  totalVotes: number | undefined;
}

const STARS = 5;

export const DisplayStars: React.FC<DisplayStarsProps> = ({
  rating = 0,
  totalVotes = 0,
}) => {
  const [floor, ceil] = [Math.floor(rating), Math.ceil(rating)];
  const decimal = rating - floor;

  const stars = [...Array(STARS)].map((_, index) => {
    const count = index + 1;
    if (count <= floor) return <BsStarFill size="12" key={index} />;

    if (decimal >= 0.5 && count <= ceil)
      return <BsStarHalf size="12" key={index} />;

    return <BsStar size="12" key={index} />;
  });

  return (
    <div>
      {rating ? (
        <div className="flex">{stars}</div>
      ) : (
        <div className="flex">
          <BsStar size="12" color="lightGray" />;
          <BsStar size="12" color="lightGray" />;
          <BsStar size="12" color="lightGray" />;
          <BsStar size="12" color="lightGray" />;
          <BsStar size="12" color="lightGray" />;
          <em className="text-xs" color="lightGray">{`(${totalVotes})`}</em>
        </div>
      )}
    </div>
  );
};
// <em className="text-xs">{`(${totalVotes})`}</em>
