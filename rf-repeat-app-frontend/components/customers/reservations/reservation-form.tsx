"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
};

export default function ReservationForm() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
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

        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("顧客一覧の取得に失敗しました", error);
        setErrors(["顧客一覧の取得に失敗しました"]);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrors([]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
      }

      const res = await fetch(`${baseUrl}/api/v1/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservation: {
            customer_id: Number(customerId),
            visited_at: visitedAt,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["予約登録に失敗しました"]);
        return;
      }

      const customerName =
        customers.find((customer) => customer.id === Number(customerId))
          ?.name || "顧客";

      setMessage(`予約を登録しました（${customerName}）`);
      setCustomerId("");
      setVisitedAt("");
    } catch (error) {
      console.error("予約登録に失敗しました", error);
      setErrors(["通信エラーが発生しました"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer" className="block mb-2 text-sm font-medium">
            顧客
          </label>
          <select
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">選択してください</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="visitedAt" className="block mb-2 text-sm font-medium">
            来店日時
          </label>
          <input
            id="visitedAt"
            type="datetime-local"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          {loading ? "登録中..." : "予約を登録する"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}

      {errors.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
