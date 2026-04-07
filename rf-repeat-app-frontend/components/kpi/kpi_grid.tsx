import { KpiCard } from "./kpi_card";

type Props = {
  data: {
    title: string;
    value: string | number;
    diff?: number;
  }[];
};

export const KpiGrid = ({ data }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {data.map((item, i) => (
        <KpiCard key={i} {...item} />
      ))}
    </div>
  );
};
