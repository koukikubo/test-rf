import ReservationBasicInfo from "@/components/reservations/reservation-basic-info";
import ReservationMetaInfo from "@/components/reservations/reservation-meta-info";

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

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservation(id);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">予約詳細</h1>

      <ReservationBasicInfo
        id={reservation.id}
        customerId={reservation.customer_id}
        visitedAt={reservation.visited_at}
      />

      <ReservationMetaInfo
        createdAt={reservation.created_at}
        updatedAt={reservation.updated_at}
      />
    </main>
  );
}
