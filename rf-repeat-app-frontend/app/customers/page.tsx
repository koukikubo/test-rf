import CustomerTable from "@/components/customers/customer-table";

type Customer = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

async function getCustomers(): Promise<Customer[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/customers`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("顧客一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">顧客一覧</h1>
      <CustomerTable customers={customers} />
    </main>
  );
}
