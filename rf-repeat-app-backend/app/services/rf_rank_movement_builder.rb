class RfRankMovementBuilder
  RANKS = RfRankMaster.all.freeze

  def self.call
    new.call
  end

  def call
    current_base_month = base_month
    current_base_date = current_base_month.end_of_month
    previous_base_date = (current_base_month - 1.month).end_of_month

    current_month_label = current_base_month.strftime("%Y年%m月")
    previous_month_label = (current_base_month - 1.month).strftime("%Y年%m月")

    matrix = build_empty_matrix

    Customer.includes(:reservations).find_each do |customer|
      customer_reservations = customer.reservations.select do |reservation|
        reservation.visited_at.present?
      end

      previous_result = RfRankRule.call(
        reservations: customer_reservations,
        base_date: previous_base_date
      )

      current_result = RfRankRule.call(
        reservations: customer_reservations,
        base_date: current_base_date
      )

      from_rank = previous_result[:rank]
      to_rank = current_result[:rank]

      matrix[from_rank][to_rank] += 1
    end

    total_count = matrix.values.sum { |row| row.values.sum }

    cells = []
    row_totals = []
    col_totals = build_empty_totals

    RANKS.each do |from_rank|
      row_total = 0

      RANKS.each do |to_rank|
        count = matrix[from_rank[:key]][to_rank[:key]]
        row_total += count
        col_totals[to_rank[:key]] += count

        percentage =
          if total_count.zero?
            0.0
          else
            (count.to_f / total_count * 100).round(1)
          end

        cells << {
          from_rank_key: from_rank[:key],
          from_rank_label: from_rank[:label],
          to_rank_key: to_rank[:key],
          to_rank_label: to_rank[:label],
          count: count,
          percentage: percentage
        }
      end

      row_percentage =
        if total_count.zero?
          0.0
        else
          (row_total.to_f / total_count * 100).round(1)
        end

      row_totals << {
        rank_key: from_rank[:key],
        rank_label: from_rank[:label],
        count: row_total,
        percentage: row_percentage
      }
    end

    column_totals = RANKS.map do |to_rank|
      count = col_totals[to_rank[:key]]

      percentage =
        if total_count.zero?
          0.0
        else
          (count.to_f / total_count * 100).round(1)
        end

      {
        rank_key: to_rank[:key],
        rank_label: to_rank[:label],
        count: count,
        percentage: percentage
      }
    end

    {
      current_month_label: current_month_label,
      previous_month_label: previous_month_label,
      row_ranks: RANKS,
      col_ranks: RANKS,
      cells: cells,
      row_totals: row_totals,
      col_totals: column_totals,
      grand_total: total_count
    }
  end

  private

  def base_month
    Time.current.prev_month
  end

  def build_empty_matrix
    RANKS.each_with_object({}) do |from_rank, outer_hash|
      outer_hash[from_rank[:key]] = RANKS.each_with_object({}) do |to_rank, inner_hash|
        inner_hash[to_rank[:key]] = 0
      end
    end
  end

  def build_empty_totals
    RANKS.each_with_object({}) do |rank, hash|
      hash[rank[:key]] = 0
    end
  end
end