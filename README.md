# RFリピート分析・予約管理アプリ

本プロジェクトは、顧客の来店履歴をもとに「来店回数」や「最終来店日」を集計し、**RFランクを可視化するリピート分析アプリ**です。
Rails API と Next.js フロントエンドで構成されており、将来的に飲食店向けCRM（顧客関係管理）へ拡張するための基盤として開発しています。

---

##  概要

飲食店における「予約管理」と「顧客管理」を軸としたアプリケーションです。
顧客ごとの来店状況を分析し、RFランク（顧客の重要度）を算出することで、ランキング表示や詳細な分析を可能にします。

### 実装済みのコア機能
- **顧客・予約管理**: 登録、一覧、詳細表示
- **RF分析**: スコアの自動算出・保存、ランキング表示
- **非同期処理**: 予約登録時の自動スコア更新（Active Job）
- **バッチ処理**: 全顧客を対象とした一括スコア更新タスク

---

##  目的・背景

### 目的
- 顧客ごとの来店状況を可視化し、リピーター分析を可能にする。
- 飲食店向けCRM機能拡張のための、堅牢なデータ構造を整備する。
- 顧客詳細、予約履歴、RF情報を一元管理する基盤を構築する。

### 背景
従来の顧客管理システムでは情報の蓄積に留まり、「直近いつ来たか」「何度目か」といった分析が困難でした。本アプリではこれらの数値を自動集計し、マーケティング施策に活用できる土台を提供します。

---

##  技術構成

| カテゴリ | 技術スタック |
| :--- | :--- |
| **Backend** | Ruby on Rails (API Mode / Docker) |
| **Frontend** | Next.js / TypeScript |
| **Database** | PostgreSQL |
| **Test** | RSpec |

---

##  RFランクの定義

本アプリでは、以下の指標を用いて顧客をA〜Eの5段階でランク付けします。

- **R (Recency)**: 最終来店日（どれくらい最近か）
- **F (Frequency)**: 来店回数（どれくらい頻繁か）

### ランク判定ルール
| ランク | 判定条件 |
| :---: | :--- |
| **A** | 1年以内の来店 **かつ** 来店回数 20回以上 |
| **B** | 1年以内の来店 **かつ** 来店回数 10回以上 |
| **C** | 1年以内の来店 **かつ** 来店回数 5回以上 |
| **D** | 3年以内の来店 **かつ** 来店回数 5回以上 |
| **E** | 上記以外（新規顧客や休眠顧客） |

---

##  RFスコア更新の仕組み

### 1. 個別更新（リアルタイム）
予約が登録・更新されると、`after_commit` フックにより `RfScoreUpdateJob` がキューイング（enqueue）され、該当顧客のスコアがバックグラウンドで自動更新されます。

### 2. 全体更新（定期バッチ）
予約が動いていない「来店のない顧客」のランクダウン（時間の経過による変化）を反映させるため、一括更新タスクを用意しています。

**実行コマンド:**
```bash
docker compose exec backend rails rf:update_rf_scores
```

## データベース設計

### Customers テーブル
顧客の基本情報を管理します。
- `has_many :reservations`
- `has_one :rf_score`

| Column | Type | Options |
| :--- | :--- | :--- |
| name | string | null: false |

---

### Reservations テーブル
顧客の来店履歴を管理します。
- `belongs_to :customer`

| Column | Type | Options |
| :--- | :--- | :--- |
| customer_id | references | null: false, foreign_key: true |
| visited_at | datetime | null: false |

---

### Rf_scores テーブル
RF集計結果を保存します。ランキングや詳細画面で利用します。
- `belongs_to :customer`

| Column | Type | Options |
| :--- | :--- | :--- |
| customer_id | references | null: false, foreign_key: true |
| visit_count | integer | null: false, default: 0 |
| last_visit_at | datetime | null: true |
| rank | string | null: false, default: 'E' |

---

##  API & 画面構成

### API エンドポイント
- **顧客**
  - `POST /api/v1/customers` : 顧客登録
  - `GET /api/v1/customers` : 顧客一覧取得
  - `GET /api/v1/customers/:id` : 顧客詳細取得（RF情報・予約履歴を含む）
- **予約**
  - `POST /api/v1/reservations` : 予約登録
  - `GET /api/v1/reservations` : 予約一覧取得
  - `GET /api/v1/reservations/:id` : 予約詳細取得
- **RF分析**
  - `GET /api/v1/rf_scores` : RFランキング取得

### フロントエンド画面
- `/customers/new` : 顧客登録画面
- `/customers` : 顧客一覧画面
- `/customers/[id]` : 顧客詳細画面
- `/reservations/new` : 予約登録画面
- `/reservations` : 予約一覧画面
- `/reservations/[id]` : 予約詳細画面
- `/rf-ranking` : RFランキング画面

---

## 🧪 テスト
RSpec により、以下のスペックを中心に動作確認を行っています。
- **Request Spec / Service Spec**
  - RFランク計算ロジック
  - RF更新Job (ActiveJob)
  - 顧客・予約関連の各API（登録・一覧・詳細）

---

## 開発状況

###  実装済み
- [x] API基盤構築 / ER設計 / DB作成
- [x] seedデータ作成
- [x] RFランク計算ロジック・保存処理
- [x] RFランキングAPI & 画面表示
- [x] 予約登録時のRFスコア自動更新（非同期Job）
- [x] 顧客・予約のCRUD機能（登録/一覧/詳細）
- [x] RSpecによるテスト実装

###  今後の拡張予定
- [ ] RFスコア全体更新運用の整備（Issue #23）
- [ ] RFM定義マスタの作成（DB管理化）
- [ ] RFM分析マトリックス図の作成
- [ ] セル別顧客一覧表示
- [ ] 飲食店向けCRM機能（メッセージ配信等）の拡張

---

##  補足
このリポジトリは、RF分析・予約管理を中心とした最小構成の検証用アプリです。
将来的には、飲食店の予約・顧客管理・分析を一気通貫で行えるCRMシステムへの発展を構想しています。
