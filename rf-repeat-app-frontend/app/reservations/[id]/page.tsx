type ReservationDetail = {
  id: number;
  customer_id: number;
  visited_at: string;
  created_at: string;
  updated_at: string;
};

async function getReservation(id: string): Promise<ReservationDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/reservations/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("予約詳細の取得に失敗しました");
  }

  return res.json();
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservation(id);

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">予約詳細</h1>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">基本情報</h2>
        <p>予約ID: {reservation.id}</p>
        <p>顧客ID: {reservation.customer_id}</p>
        <p>来店日時: {formatDate(reservation.visited_at)}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">記録情報</h2>
        <p>作成日時: {formatDate(reservation.created_at)}</p>
        <p>更新日時: {formatDate(reservation.updated_at)}</p>
      </section>
    </main>
  );
}
