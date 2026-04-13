import { useMemo, useState } from "react";
import type { RfMovementResponse } from "@/types/rf/movement_builder";

type UseMovementSelectionParams = {
  movement: RfMovementResponse;
};

type UseMovementSelectionReturn = {
  selectedCells: string[];
  selectedCount: number;
  selectedCustomerIds: number[];

  toggleCell: (from: string, to: string) => void;
  clearSelection: () => void;
  isSelected: (from: string, to: string) => boolean;
};

export function useMovementSelection({
  movement,
}: UseMovementSelectionParams): UseMovementSelectionReturn {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  // セルの選択状態を管理するためのキーを生成する関数
  const buildKey = (from: string, to: string) => `${from}-${to}`;

  const toggleCell = (from: string, to: string) => {
    // 選択状態を切り替えるためのキーを生成
    const key = buildKey(from, to);

    setSelectedCells((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };
  // セルが選択されているかを判定する関数
  const isSelected = (from: string, to: string) => {
    return selectedCells.includes(buildKey(from, to));
  };
  // 選択をクリアする関数
  const clearSelection = () => {
    setSelectedCells([]);
  };
  // 選択されたセルに対応する顧客IDを取得（重複を排除）
  const selectedCustomerIds = useMemo(() => {
    const ids = movement.cells
      .filter((cell) =>
        selectedCells.includes(buildKey(cell.from_rank_key, cell.to_rank_key)),
      )
      .flatMap((cell) => cell.customer_ids ?? []);

    return [...new Set(ids)];
  }, [movement.cells, selectedCells]);

  return {
    selectedCells,
    selectedCount: selectedCells.length,
    selectedCustomerIds,
    toggleCell,
    clearSelection,
    isSelected,
  };
}
