import ReservationTable from "@/components/reservations/reservation-table";

type ReservationCustomer = {
  id: number;
  name: string;
};

type Reservation = {
  id: number;
  visited_at: string;
  customer: ReservationCustomer;
};

async function getReservations(): Promise<Reservation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/reservations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("予約一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return (
    <main className="p-6">
      <ReservationTable reservations={reservations} />
    </main>
  );
}
