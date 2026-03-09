"use client";

import { useEffect, useState } from "react";
// 一時的にRailsのヘルスチェックAPIを叩いて接続確認するだけのコード
export default function Home() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1>API Connection Test</h1>
      <p>Status: {status}</p>
    </div>
  );
}
