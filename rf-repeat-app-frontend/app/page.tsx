import { KpiGrid } from "@/components/kpi/kpi_grid";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type Reservation = {
  id: number;
  visited_at: string;
  customer: {
    id: number;
    name: string;
  };
};

type RankSummary = {
  rank: string;
  count: number;
};

type RfRankSummaryResponse = {
  ranks: RankSummary[];
  active_total: number;
  rank_out_total: number;
  out_of_scope_total: number;
  all_customers_total: number;
};

// 今日判定
function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// API取得
async function getSummary(): Promise<RfRankSummaryResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/v1/rf_rank_summaries`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("summary取得失敗");

  return res.json();
}

async function getReservations(): Promise<Reservation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/v1/reservations`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("reservations取得失敗");

  return res.json();
}

// 👇 ここが重要（async）
export default async function Home() {
  const summary = await getSummary();
  const reservations = await getReservations();

  const todayReservations = reservations.filter((r) => isToday(r.visited_at));

  return (
    <div className="space-y-6 p-6">
      {/* KPI */}
      <KpiGrid
        kpis={[
          { title: "今日の予約", value: `${todayReservations.length}件` },
          { title: "登録顧客", value: `${summary.all_customers_total}人` },
          { title: "アクティブ顧客", value: `${summary.active_total}人` },
          { title: "休眠顧客", value: `${summary.rank_out_total}人` },
        ]}
      />

      {/* RFサマリー */}
      <Table>
        <TableBody>
          {summary.ranks.map((rank) => (
            <TableRow key={rank.rank}>
              <TableCell>{rank.rank}</TableCell>
              <TableCell>{rank.count}人</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
