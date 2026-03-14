type Reservation = {
  id: number;
  visited_at: string;
};

type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
};

type CustomerDetail = {
  id: number;
  name: string;
  rf_score: RfScore | null;
  reservations: Reservation[];
};

async function getCustomer(id: string): Promise<CustomerDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/customers/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("顧客詳細の取得に失敗しました");
  }

  return res.json();
}

function formatDate(dateString: string | null) {
  if (!dateString) return "未設定";

  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold">顧客詳細</h1>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">基本情報</h2>
        <p>顧客ID: {customer.id}</p>
        <p>顧客名: {customer.name}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">RF情報</h2>
        <p>来店回数: {customer.rf_score?.visit_count ?? 0}</p>
        <p>
          最終来店日: {formatDate(customer.rf_score?.last_visit_at ?? null)}
        </p>
        <p>ランク: {customer.rf_score?.rank ?? "未設定"}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">予約履歴</h2>

        {customer.reservations.length === 0 ? (
          <p>予約履歴はありません</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  予約ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  来店日時
                </th>
              </tr>
            </thead>
            <tbody>
              {customer.reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {reservation.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(reservation.visited_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
