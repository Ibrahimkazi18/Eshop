import * as React from "react";
const SVGComponent = ({fill} : {fill : string}) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <g fill="#494c4e" fillRule="evenodd">
      <rect rx={2} width={8} height={12} fill={fill} />
      <rect y={14} rx={2} width={8} height={4} fill={fill} />
      <rect x={10} rx={2} width={8} height={7} fill={fill} />
      <rect x={10} y={9} rx={2} width={8} height={9} fill={fill} />
    </g>
  </svg>
);
export default SVGComponent;