import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>各種マスタ管理や設定変更を行う画面です。</p>

          <div>
            <Link href="/setting/rf-masters" className="underline">
              RFマスタ管理へ
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
