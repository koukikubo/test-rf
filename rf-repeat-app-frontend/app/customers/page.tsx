import Link from "next/link";

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

      <div className="mb-4">
        <a href="/customers/new" className="underline">
          顧客登録ページへ
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                顧客名
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link href={`/customers/${customer.id}`}>
                    {customer.name}
                  </Link>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
