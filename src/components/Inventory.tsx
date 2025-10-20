import React, { useEffect, useState } from "react";
import {
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  useRecordContext,
  Loading,
  Error,
  FunctionField,
  ChipField,
  List,
} from "react-admin";
import { inventoryResource } from "../dataProvider/resources/inventory";
import { Item } from "../model/Item";

interface InventoryState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

/**
 * Component to display inventory items for a specific game save
 */
export const InventoryComponent: React.FC = () => {
  const gameSave = useRecordContext();
  const [inventoryState, setInventoryState] = useState<InventoryState>({
    items: [],
    loading: true,
    error: null,
  });

  /**
   * Fetches inventory items for the current game save
   */
  const fetchInventoryItems = async (gameSaveId: string) => {
    try {
      setInventoryState((prev) => ({ ...prev, loading: true, error: null }));
      const items = await inventoryResource.getInventory(gameSaveId);
      setInventoryState({
        items,
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
   * Renders loading state
   */
  const renderLoadingState = () => <Loading />;

  /**
   * Renders error state with retry option
   */
  const renderErrorState = () => (
    <div>
      <Error error={inventoryState.error} />
      <button
        onClick={() =>
          gameSave?.metadata?.id && fetchInventoryItems(gameSave.metadata.id)
        }
        style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
      >
        Retry
      </button>
    </div>
  );

  /**
   * Renders empty inventory state
   */
  const renderEmptyState = () => (
    <div style={{ padding: 16, textAlign: "center", color: "#666" }}>
      No items in inventory
    </div>
  );

  /**
   * Formats item statistics for display
   */
  const formatItemStats = (item: Item) => {
    const mainStat = `${item.mainStat.statistic}: ${item.mainStat.baseValue}`;
    const additionalStats = item.additionalStats
      .map((stat) => `${stat.statistic}: ${stat.baseValue}`)
      .join(", ");

    return additionalStats ? `${mainStat}, ${additionalStats}` : mainStat;
  };

  /**
   * Renders the inventory items in a data grid
   */
  const renderInventoryGrid = () => (
    <List>
      <Datagrid data={inventoryState.items} total={inventoryState.items.length}>
        <TextField source="clientId" label="Client ID" />
        <TextField source="blueprintId" label="Blueprint ID" />
        <ChipField
          source="itemType"
          label="Type"
          sx={{
            "& .RaChipField-chip": {
              textTransform: "capitalize",
            },
          }}
        />
        <ChipField
          source="itemRarity"
          label="Rarity"
          sx={{
            "& .RaChipField-chip": {
              textTransform: "capitalize",
              backgroundColor: (theme) => {
                // Color coding for rarity
                const colors: Record<string, string> = {
                  normal: theme.palette.grey[400],
                  rare: theme.palette.info.main,
                  magic: theme.palette.secondary.main,
                  epic: theme.palette.warning.main,
                  legendary: theme.palette.error.main,
                  mythic: theme.palette.primary.main,
                };
                return (
                  colors[
                    inventoryState.items.find((item) => item.id === theme.id)
                      ?.itemRarity || "normal"
                  ] || theme.palette.grey[400]
                );
              },
            },
          }}
        />
        <NumberField source="level" label="Level" />
        <BooleanField source="isEquipped" label="Equipped" />
        <FunctionField
          label="Statistics"
          render={(record: Item) => formatItemStats(record)}
        />
      </Datagrid>
    </List>
  );

  /**
   * Main render method
   */
  const renderInventoryContent = () => {
    if (inventoryState.loading) {
      return renderLoadingState();
    }

    if (inventoryState.error) {
      return renderErrorState();
    }

    if (inventoryState.items.length === 0) {
      return renderEmptyState();
    }

    return renderInventoryGrid();
  };

  // Don't render if no game save is available
  if (!gameSave?.metadata?.id) {
    return <div>No game save selected</div>;
  }

  return (
    <div>
      <h3>Inventory ({inventoryState.items.length} items)</h3>
      {renderInventoryContent()}
    </div>
  );
};
