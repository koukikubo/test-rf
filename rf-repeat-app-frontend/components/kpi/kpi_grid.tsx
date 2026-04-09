import { KpiCard } from "./kpi_card";

type Props = {
  kpis: {
    title: string;
    value: string | number;
    diff?: number | null;
  }[];
};

export const KpiGrid = ({ kpis }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((item, i) => (
        <KpiCard key={i} {...item} />
      ))}
    </div>
  );
};
