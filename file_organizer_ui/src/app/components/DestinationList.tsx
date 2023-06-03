"use client";
import { useState } from "react";
import { Button } from "primereact/button";

interface HoverToShowProps extends React.HTMLAttributes<HTMLDivElement> {
  contentToShow: React.ReactNode;
}

function HoverToShow({
  children,
  contentToShow,
  ...otherProps
}: HoverToShowProps) {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} {...otherProps}>
      {children}
      {isHovering && contentToShow}
    </div>
  );
}

export default function DestinationList({
  destinations,
  setDestinations,
}: {
  destinations: string[];
  setDestinations: (destinations: string[]) => void;
}) {
  return (
    <ul>
      {destinations.map((dest) => (
        <li className="mb-2 pb-2 border-b-2" key={dest}>
            <HoverToShow
              className="flex justify-between"
              contentToShow={
                <Button
                  icon="pi pi-trash"
                  size="small"
                  outlined
                  severity="danger"
                  className="ml-2"
                  onClick={() =>
                    setDestinations(destinations.filter((d) => d !== dest))
                  }
                />
              }
              data-pr-tooltip={dest}
              data-pr-position="left"
            >
              <div className="truncate leading-10 -app-tooltip">
                {dest}
              </div>
            </HoverToShow>
        </li>
      ))}
    </ul>
  );
}
