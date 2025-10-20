import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { useRecordContext } from "react-admin";
import { inventoryResource } from "../dataProvider/resources/inventory";
import { Item } from "../model/Item";

type SortField = keyof Item | "mainStatValue";
type SortDirection = "asc" | "desc";

interface InventoryState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Component to display inventory items for a specific game save with sortable columns
 */
export const InventoryComponent: React.FC = () => {
  const gameSave = useRecordContext();
  const [inventoryState, setInventoryState] = useState<InventoryState>({
    items: [],
    loading: true,
    error: null,
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "clientId",
    direction: "asc",
  });

  /**
   * Fetches inventory items for the current game save
   */
  const fetchInventoryItems = async (gameSaveId: string) => {
    try {
      setInventoryState((prev) => ({ ...prev, loading: true, error: null }));
      const items = await inventoryResource.getInventory(gameSaveId);
      setInventoryState({
        items: Array.isArray(items) ? items : [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
      setInventoryState({
        items: [],
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load inventory",
      });
    }
  };

  /**
   * Effect to load inventory when game save changes
   */
  useEffect(() => {
    if (gameSave?.metadata?.id) {
      fetchInventoryItems(gameSave.metadata.id);
    }
  }, [gameSave?.metadata?.id]);

  /**
   * Handle sorting
   */
  const handleSort = (field: SortField) => {
    const newDirection =
      sortConfig.field === field && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ field, direction: newDirection });
  };

  /**
   * Sort items based on current sort configuration
   */
  const sortedItems = React.useMemo(() => {
    if (!inventoryState.items.length) return [];

    return [...inventoryState.items].sort((a, b) => {
      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      switch (sortConfig.field) {
        case "mainStatValue":
          aValue = a.mainStat.baseValue;
          bValue = b.mainStat.baseValue;
          break;
        case "level":
          aValue = a.level;
          bValue = b.level;
          break;
        case "isEquipped":
          aValue = a.isEquipped ? 1 : 0;
          bValue = b.isEquipped ? 1 : 0;
          break;
        default:
          aValue = a[sortConfig.field];
          bValue = b[sortConfig.field];
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [inventoryState.items, sortConfig]);

  /**
   * Get rarity color for chip
   */
  const getRarityColor = (rarity?: string) => {
    const colorMap: Record<
      string,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      normal: "default",
      rare: "info",
      magic: "secondary",
      epic: "warning",
      legendary: "error",
      mythic: "primary",
    };
    return rarity ? colorMap[rarity] || "default" : "default";
  };

  /**
   * Format item statistics for display
   */
  const formatItemStats = (item: Item) => {
    const mainStat = `${item.mainStat.statistic}: ${item.mainStat.baseValue}`;
    const additionalStats = item.additionalStats
      .map((stat) => `${stat.statistic}: ${stat.baseValue}`)
      .join(", ");

    return additionalStats ? `${mainStat}, ${additionalStats}` : mainStat;
  };

  /**
   * Render sortable table header
   */
  const SortableTableCell = ({
    field,
    children,
    align = "left",
  }: {
    field: SortField;
    children: React.ReactNode;
    align?: "left" | "right" | "center";
  }) => (
    <TableCell align={align}>
      <TableSortLabel
        active={sortConfig.field === field}
        direction={sortConfig.field === field ? sortConfig.direction : "asc"}
        onClick={() => handleSort(field)}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );

  // Don't render if no game save is available
  if (!gameSave?.metadata?.id) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary">
          No game save selected
        </Typography>
      </Box>
    );
  }

  // Loading state
  if (inventoryState.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading inventory...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (inventoryState.error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {inventoryState.error}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => fetchInventoryItems(gameSave.metadata.id)}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Empty state
  if (sortedItems.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary" align="center">
          No items in inventory
        </Typography>
      </Box>
    );
  }

  // Main inventory table
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Inventory ({sortedItems.length} items)
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <SortableTableCell field="clientId">Client ID</SortableTableCell>
              <SortableTableCell field="blueprintId">
                Blueprint ID
              </SortableTableCell>
              <SortableTableCell field="itemType">Type</SortableTableCell>
              <SortableTableCell field="itemRarity">Rarity</SortableTableCell>
              <SortableTableCell field="level" align="right">
                Level
              </SortableTableCell>
              <SortableTableCell field="isEquipped" align="center">
                Equipped
              </SortableTableCell>
              <SortableTableCell field="mainStatValue" align="right">
                Main Stat Value
              </SortableTableCell>
              <TableCell>Statistics</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow key={item.id || item.clientId} hover>
                <TableCell>{item.clientId}</TableCell>
                <TableCell>{item.blueprintId}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {item.type}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.itemRarity || "normal"}
                    color={getRarityColor(item.itemRarity)}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell align="right">{item.level}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.isEquipped ? "Yes" : "No"}
                    color={item.isEquipped ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{item.mainStat.baseValue}</TableCell>
                <TableCell>{formatItemStats(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
