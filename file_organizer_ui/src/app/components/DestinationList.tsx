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
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...otherProps}
    >
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
        <li
          className="border-b-2 py-1 last:border-none leading-10"
          data-pr-tooltip={dest}
          data-pr-position="left"
          key={dest}
        >
          <HoverToShow
            className="flex justify-between"
            contentToShow={
              <Button
                icon="pi pi-trash"
                size="small"
                outlined
                severity="danger"
                className="ml-2 text-xs"
                rounded
                text
                title="Remove this destination"
                onClick={() =>
                  setDestinations(destinations.filter((d) => d !== dest))
                }
              />
            }
          >
            <div className="truncate" title={dest}>
              {dest}
            </div>
          </HoverToShow>
        </li>
      ))}
    </ul>
  );
}
