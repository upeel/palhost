import { ReactElement } from "react";

const Stats = (props: { title: string; icon: ReactElement; value: number }) => {
  return (
    <div className="rounded-none border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{props.title}</h3>
        {props.icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{props.value}</div>
      </div>
    </div>
  );
};

export default Stats;
