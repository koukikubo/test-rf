import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string | number;
  diff?: number;
};

export const KpiCard = ({ title, value, diff }: Props) => {
  const isUp = diff && diff > 0;
  const isDown = diff && diff < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {diff !== undefined && (
          <p
            className={cn(
              "text-sm",
              isUp && "text-green-500",
              isDown && "text-red-500",
              !isUp && !isDown && "text-gray-500",
            )}
          >
            {isUp && "↑"}
            {isDown && "↓"}
            {diff}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
