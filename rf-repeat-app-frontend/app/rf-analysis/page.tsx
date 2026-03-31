import RfMatrixCard from "@/components/rf/rf-matrix-card";

type MatrixRow = {
  key: string;
  label: string;
};

type MatrixCol = {
  key: string;
  label: string;
  rank_key: string;
  rank_label: string;
};

type MatrixCell = {
  row_key: string;
  row_label: string;
  col_key: string;
  col_label: string;
  rank_key: string;
  rank_label: string;
  count: number;
  percentage: number;
  customer_ids: number[];
};

type RfMatrixResponse = {
  analysis_month_label: string;
  period_start: string;
  period_end: string;
  rows: MatrixRow[];
  cols: MatrixCol[];
  cells: MatrixCell[];
};

async function getRfMatrix(): Promise<RfMatrixResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_matrices`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFMマトリクスの取得に失敗しました");
  }

  return res.json();
}

export default async function RfMatricesPage() {
  const matrix = await getRfMatrix();

  return (
    <main className="p-6">
      <RfMatrixCard matrix={matrix} />
    </main>
  );
}
