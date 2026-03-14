"use client";

import { useState } from "react";

export default function CustomerForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

      const res = await fetch(`${baseUrl}/api/v1/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["顧客登録に失敗しました"]);
        return;
      }

      setMessage(`顧客「${data.name}」を登録しました`);
      setName("");
    } catch (error) {
      console.error(error);
      setErrors(["通信エラーが発生しました"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            顧客名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="山田太郎"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          {loading ? "登録中..." : "登録する"}
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
