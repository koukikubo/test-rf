import Link from "next/link";

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default async function ReservationsPage() {
  const reservations = await getReservations();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">予約一覧</h1>

      <div className="mb-4 space-x-4">
        <Link href="/reservations/new" className="underline">
          予約登録ページへ
        </Link>
      </div>

      {reservations.length === 0 ? (
        <p>予約はありません</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  予約ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  顧客名
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  来店日時
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/reservations/${reservation.id}`}
                      className="underline"
                    >
                      {reservation.id}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/customers/${reservation.customer.id}`}
                      className="underline"
                    >
                      {reservation.customer.name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(reservation.visited_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
