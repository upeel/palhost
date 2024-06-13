import { ReactElement } from "react";

const LeftMenuItem = (props: {
  title: string;
  icon: ReactElement;
  onClick?: () => void;
}) => {
  return (
    <>
      <div
        className="p-4 flex flex-row items-center gap-4 cursor-pointer"
        onClick={() => (props.onClick ? props.onClick() : null)}
      >
        {props.icon}
        <span>{props.title}</span>
      </div>
    </>
  );
};

export default LeftMenuItem;
