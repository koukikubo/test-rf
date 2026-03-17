import CustomerBasicInfo from "@/components/customers/customer-basic-info";
import CustomerReservationsTable from "@/components/customers/customer-reservations-table";
import CustomerRfInfo from "@/components/customers/customer-rf-info";

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

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">顧客詳細</h1>

      <CustomerBasicInfo id={customer.id} name={customer.name} />

      <CustomerRfInfo rfScore={customer.rf_score} />

      <CustomerReservationsTable reservations={customer.reservations} />
    </main>
  );
}
