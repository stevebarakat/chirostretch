import React from "react";

type Props = {
  as?: string;
  children: React.ReactNode;
  level: number;
};

function Heading({ as, children, level }: Props) {
  const H = as || `h${level}`;

  return React.createElement(H, null, children);
}

export default Heading;
