import React from "react";

interface BikeAnimationProps {
  text: string;
  textColor?: string;
  tireColor?: string;
  pedalColor?: string;
  bodyColor?: string;
}

const BikeAnimation: React.FC<BikeAnimationProps> = ({
  text,
  textColor = "text-gray-600", // Default color
  tireColor = "currentColor", // Default to current text color
  pedalColor = "currentColor", // Default to current text color
  bodyColor = "", // Default color
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`text-lg font-bold ${textColor} mb-2`}>{text}</div>

      <svg className="block w-64 h-auto" viewBox="0 0 48 30">
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        >
          {/* Left tire and spokes */}
          <g transform="translate(9.5,19)">
            <circle
              className="animate-bikeTire"
              r="9"
              strokeDasharray="56.549 56.549"
              stroke={tireColor}
            />
            <g
              className="animate-bikeSpokesSpin"
              strokeDasharray="31.416 31.416"
              strokeDashoffset="-23.562"
            >
              <circle r="5" stroke={pedalColor} />
              <circle r="5" transform="rotate(180,0,0)" stroke={pedalColor} />
            </g>
          </g>

          {/* Pedals */}
          <g transform="translate(24,19)">
            <g
              className="animate-bikePedalsSpin"
              strokeDasharray="25.133 25.133"
              strokeDashoffset="-21.991"
              transform="rotate(67.5,0,0)"
            >
              <circle r="4" stroke={pedalColor} />
              <circle r="4" transform="rotate(180,0,0)" stroke={pedalColor} />
            </g>
          </g>

          {/* Right tire and spokes */}
          <g transform="translate(38.5,19)">
            <circle
              className="animate-bikeTire"
              r="9"
              strokeDasharray="56.549 56.549"
              stroke={tireColor}
            />
            <g
              className="animate-bikeSpokesSpin"
              strokeDasharray="31.416 31.416"
              strokeDashoffset="-23.562"
            >
              <circle r="5" stroke={pedalColor} />
              <circle r="5" transform="rotate(180,0,0)" stroke={pedalColor} />
            </g>
          </g>

          {/* Bike body */}
          <polyline
            className={`stroke-${bodyColor}`}
            points="14 3,18 3"
            strokeDasharray="5 5"
          />
          <polyline
            className={`stroke-${bodyColor}`}
            points="16 3,24 19,9.5 19,18 8,34 7,24 19"
            strokeDasharray="79 79"
          />
          <path
            className={`stroke-${bodyColor}`}
            d="m30,2h6s1,0,1,1-1,1-1,1"
            strokeDasharray="10 10"
          />
          <polyline
            className={`stroke-${bodyColor}`}
            points="32.5 2,38.5 19"
            strokeDasharray="19 19"
          />
        </g>
      </svg>
    </div>
  );
};

export default BikeAnimation;
