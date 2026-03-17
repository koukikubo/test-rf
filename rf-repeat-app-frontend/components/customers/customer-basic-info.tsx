import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  id: number;
  name: string;
};

export default function CustomerBasicInfo({ id, name }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>顧客ID: {id}</p>
        <p>顧客名: {name}</p>
      </CardContent>
    </Card>
  );
}
