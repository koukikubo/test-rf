本プロジェクトは、顧客の来店履歴をもとに来店回数・最終来店日を集計し、RFランクを可視化するリピート分析アプリです。
Rails API と Next.js フロントエンドで構成し、将来的には飲食店向けCRMへの拡張を想定しています。

# 概要
飲食店向けの予約アプリです。顧客の来店履歴をもとに来店頻度と最終来店日を集計し、RFランクを可視化するアプリです。
リピート率や設定されたランクに対してお店がお客様との接点を効率よく行えるための機能を実装します。
Rails API + Next.js構成で開発しており、将来的には飲食店向けCRMへの拡張を想定しているための土台アプリとして開発します。

# 目的
- 顧客ごとの来店状況を可視化する
- リピーター分析を行う
- CRM機能拡張の土台となるデータ構造を整備する
# RFリピートランクアプリ
顧客の来店履歴をもとに、来店回数と最終来店日を集計し、RFランクを可視化するCRM基盤アプリです。
## 背景
既存の顧客管理では、顧客情報の登録に留まり、来店回数や最終来店日をもとにした分析が難しい課題があります。  
本プロジェクトでは、来店履歴を集計してリピーターの可視化を行い、将来的なCRM機能拡張の土台を作ることを目的としています。

## 機能一覧
- 顧客情報の管理機能
- 来店履歴の登録
- - 来店回数・最終来店日の集計
- RFランクの保存
- RFランキングAPIの提供
- RFランキング表示
- RF集計画面表示

## RFとは
- R = Recency（最終来店日）
- F = Frequency（来店回数）
現在は、来店回数 (`visit_count`) と最終来店日 (`last_visit_at`) をもとに、顧客ごとのランクを保持する構成です。

## 技術構成
- Backend: Ruby on Rails API(Docker)
- Frontend: Next.js / TypeScript
- Database: PostgreSQL
- Test: RSpec
  
## テーブル設計
顧客の基本情報を管理するテーブルです。
## Customers テーブル

| Column     | Type     | Options     |
| ---------- | -------- | ----------- |
| name       | string   | null: false |
| created_at | datetime | null: false |
| updated_at | datetime | null: false |

### associations

- has_many :reservations
- has_one :rf_score

### Reservations テーブル
顧客の来店履歴を管理するテーブルです。

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| customer_id | references | null: false, foreign_key: true |
| visited_at  | datetime   | null: false                    |
| created_at  | datetime   | null: false                    |

## associations

belongs_to :customer

### Rf_scores テーブル
顧客ごとのRF集計結果を保存するテーブルです。  
ランキング表示や集計画面で利用することを想定しています。

| Column        | Type       | Options                        |
| ------------- | ---------- | ------------------------------ |
| customer_id   | references | null: false, foreign_key: true |
| visit_count   | integer    | null: false                    |
| last_visit_at | datetime   | null: false                    |
| rank          | string     | null: false                    |

## associations

- belongs_to :customer

## 開発タスク
GitHub Issues をベースに開発を進めています。

### 基本機能
- #1 API基盤
- #2 ER設計
- #3 DB作成
- #4 seed
- #5 RFロジック
- #6 RF保存
- #7 RFランキングAPI
- #8 RFランキング画面
- #9 RF集計画面
- #12 RSpec

### CRM拡張
- #13 visitsテーブル
- #14 tablesテーブル
- #15 tags
- #16 notes

---
## 開発状況

### 実装済み
- #1 API基盤
- #2 ER設計
- #3 DB作成
- #4 seed
- #5 RFロジック
- #6 RF保存
- #7 RFランキングAPI
- #8 RFランキング画面
- #9 RF集計画面
- #12 RSpec

### CRM拡張予定
- #13 visitsテーブル
- #14 tablesテーブル
- #15 tags
- #16 notes

---

## 今後の拡張予定
現時点ではRF分析を中心とした最小構成ですが、今後は以下のようなCRM機能へ拡張予定です。

- 来店履歴の詳細管理
- テーブル情報管理
- 顧客タグ管理
- 接客メモ管理

---

## 補足
このリポジトリは、RF分析を中心とした最小構成の検証用アプリです。  
将来的には、飲食店の予約管理・顧客管理を含めたCRMシステムへ発展させる構想があります。


