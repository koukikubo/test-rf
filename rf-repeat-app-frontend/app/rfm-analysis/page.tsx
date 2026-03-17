import RfmMatrixCard from "@/components/rf/rfm-matrix-card";

type MatrixRow = {
  key: string;
  label: string;
};

type MatrixCol = {
  key: string;
  label: string;
};

type MatrixCell = {
  row_key: string;
  row_label: string;
  col_key: string;
  col_label: string;
  count: number;
  customer_ids: number[];
};

type RfmMatrixResponse = {
  rows: MatrixRow[];
  cols: MatrixCol[];
  cells: MatrixCell[];
};

async function getRfmMatrix(): Promise<RfmMatrixResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rfm_matrices`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFMマトリクスの取得に失敗しました");
  }

  return res.json();
}

export default async function RfmMatricesPage() {
  const matrix = await getRfmMatrix();

  return (
    <main className="p-6">
      <RfmMatrixCard matrix={matrix} />
    </main>
  );
}
