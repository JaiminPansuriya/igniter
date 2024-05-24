import React from "react";

interface CustomButtonProps {
  btnType?: "button" | "submit" | "reset"; // specify possible values for button type
  title: string;                          // title is required and must be a string
  handleClick?: () => void;               // handleClick is optional and must be a function
  styles?: string;                        // styles is optional and must be a string
}

// CustomButton component that can be used throughout the app
const CustomButton: React.FC<CustomButtonProps> = ({
  btnType = "button",
  title,
  handleClick,
  styles,
}) => {
  return (
    // Button will be created using given params from the parent component
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[13px] leading-[20px] text-white px-4 py-3 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
