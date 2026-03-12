// RailsのAPIから返って来るデータの型定義
type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
  customer: {
    id: number;
    name: string;
  };
};
// RFスコアのデータをRailsのAPIから取得する関数
async function getRfScores(): Promise<RfScore[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_scores/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFランキングの取得に失敗しました");
  }
  return res.json();
}
// 日付を日本語形式で表示するための関数
function formatDate(dateString: string | null) {
  if (!dateString) {
    return "来店履歴なし";
  }
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP");
}

// RFランキングページのUI
export default async function RfRankingPage() {
  const rfScores = await getRfScores();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">RFランキング一覧</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                顧客名
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                来店回数
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                最終来店日
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                ランク
              </th>
            </tr>
          </thead>
          <tbody>
            {rfScores.map((score) => (
              <tr key={score.customer.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {score.customer.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {score.visit_count}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatDate(score.last_visit_at)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {score.rank}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
