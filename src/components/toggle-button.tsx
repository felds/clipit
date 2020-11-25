import classNames from "classnames";
import React from "react";

type ToggleButtonProps = {
  status: boolean;
  onContent: React.ReactNode;
  offContent: React.ReactNode;
  onChange?(status: boolean): void;
};
export default function ToggleButton({
  status,
  onContent,
  offContent,
  onChange,
}: ToggleButtonProps) {
  const handleClick = () => {
    if (onChange) onChange(!status);
  };

  return (
    <button
      onClick={handleClick}
      className={classNames("btn--toggle", status ? "btn--on" : "btn--off")}
    >
      {status ? onContent : offContent}
    </button>
  );
}
