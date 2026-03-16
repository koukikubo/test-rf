import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b p-4">
          <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="font-bold">
              RFミニアプリ
            </Link>

            <nav className="flex gap-4">
              <Link href="/customers">顧客一覧</Link>
              <Link href="/customers/new">顧客登録</Link>
              <Link href="/reservations">予約一覧</Link>
              <Link href="/reservations/new">予約登録</Link>
              <Link href="/rf-ranking">RFランキング</Link>
              <Link href="/rfm-analysis">RFM分析表</Link>
            </nav>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
