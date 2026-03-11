本プロジェクトは、顧客の来店履歴をもとに来店回数・最終来店日を集計し、RFランクを可視化するリピート分析アプリです。
Rails API と Next.js フロントエンドで構成し、将来的には飲食店向けCRMへの拡張を想定しています。

# 目的
飲食店向けの予約アプリです。顧客の来店履歴をもとに来店頻度と最終来店日を集計し、RFランクを可視化するアプリです。
リピート率や設定されたランクに対してお店がお客様との接点を効率よく行えるための機能を実装します。
Rails API + Next.js構成で開発しており、将来的には飲食店向けCRMへの拡張を想定しているための土台アプリとして開発します。

# 背景
COLLETEという予約管理アプリを別で実装していました。
ペルソナが老舗のミシュラン星付の割烹料理店を営んでいる父から店全体がアナログ式で年一回の年賀状のみで常連さんなどは基本的に記憶管理と紙の管理のみを使用されているため、CRM機能が付与されている予約管理機能があれば力になれると思い開発することを決めました。

## 機能一覧
- 顧客管理機能
- 来店履歴登録
- RFスコア保存
- RFランキング表示
- 集計画面表示

## RFとは
- R = Recency（最終来店日）
- F = Frequency（来店回数）
今回は来店回数・最終来店日をベースにランク化を実装しました。


# テーブル設計

## Customers テーブル

| Column     | Type     | Options     |
| ---------- | -------- | ----------- |
| name       | string   | null: false |
| created_at | datetime | null: false |
| updated_at | datetime | null: false |

## associations

- has_many :reservations
- has_one :rf_score

## Reservations テーブル

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| customer_id | references | null: false, foreign_key: true |
| visited_at  | datetime   | null: false                    |
| created_at  | datetime   | null: false                    |

## associations

belongs_to :customer

## Rf_scores テーブル

| Column        | Type       | Options                        |
| ------------- | ---------- | ------------------------------ |
| customer_id   | references | null: false, foreign_key: true |
| visit_count   | integer    | null: false                    |
| last_visit_at | datetime   | null: false                    |
| rank          | string     | null: false                    |

## associations

- belongs_to :customer
