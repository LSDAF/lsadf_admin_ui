import React, { useState, useEffect } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  useShowController,
  Loading,
  Error,
  TopToolbar,
  EditButton,
  DeleteButton,
} from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  Alert,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ItemResponse, ItemRequest } from "../types/api";
import { inventoryResource } from "../dataProvider/resources/inventory.ts";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GameSaveShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const GameSaveShow = () => {
  const { record, isLoading, error } = useShowController();
  const [inventory, setInventory] = useState<ItemResponse[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

  // Form states
  const [newItem, setNewItem] = useState<ItemRequest>({
    clientId: "",
    itemType: "",
    quantity: 1,
    characteristics: {},
  });

  // Load inventory when record is available
  useEffect(() => {
    if (record?.id) {
      loadInventory();
    }
  }, [record?.id]);

  const loadInventory = async () => {
    if (!record?.id) return;

    setInventoryLoading(true);
    setInventoryError(null);

    try {
      const items = await inventoryResource.getInventory(record.id);
      setInventory(Array.isArray(items) ? items : []);
    } catch (err) {
      setInventoryError(
        err instanceof Error ? err.message : "Failed to load inventory",
      );
      setInventory([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!record?.id) return;

    try {
      await inventoryResource.createItem(record.id, newItem);
      setAddDialogOpen(false);
      setNewItem({
        clientId: "",
        itemType: "",
        quantity: 1,
        characteristics: {},
      });
      await loadInventory();
    } catch (err) {
      setInventoryError(
        err instanceof Error ? err.message : "Failed to add item",
      );
    }
  };

  const handleEditItem = async () => {
    if (!record?.id || !selectedItem) return;

    try {
      await inventoryResource.updateItem(record.id, selectedItem.clientId, {
        clientId: selectedItem.clientId,
        itemType: selectedItem.itemType,
        quantity: selectedItem.quantity,
        characteristics: selectedItem.characteristics,
      });
      setEditDialogOpen(false);
      setSelectedItem(null);
      await loadInventory();
    } catch (err) {
      setInventoryError(
        err instanceof Error ? err.message : "Failed to update item",
      );
    }
  };

  const handleDeleteItem = async (clientId: string) => {
    if (!record?.id) return;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await inventoryResource.deleteItem(record.id, clientId);
      await loadInventory();
    } catch (err) {
      setInventoryError(
        err instanceof Error ? err.message : "Failed to delete item",
      );
    }
  };

  const handleClearInventory = async () => {
    if (!record?.id) return;

    if (!window.confirm("Are you sure you want to clear the entire inventory?"))
      return;

    try {
      await inventoryResource.clearInventory(record.id);
      await loadInventory();
    } catch (err) {
      setInventoryError(
        err instanceof Error ? err.message : "Failed to clear inventory",
      );
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Show actions={<GameSaveShowActions />}>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Game Save Details" />
          <Tab label="Inventory" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <NumberField source="gold" />
            <NumberField source="healthPoints" />
            <NumberField source="attack" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
          </SimpleShowLayout>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Inventory Items</Typography>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={handleClearInventory}
                    disabled={inventory.length === 0}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              {inventoryError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {inventoryError}
                </Alert>
              )}

              {inventoryLoading ? (
                <Loading />
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client ID</TableCell>
                        <TableCell>Item Type</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Characteristics</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No items in inventory
                          </TableCell>
                        </TableRow>
                      ) : (
                        inventory.map((item) => (
                          <TableRow key={item.clientId}>
                            <TableCell>{item.clientId}</TableCell>
                            <TableCell>{item.itemType}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.characteristics
                                ? JSON.stringify(item.characteristics)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                  setSelectedItem(item);
                                  setEditDialogOpen(true);
                                }}
                                sx={{ mr: 1 }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteItem(item.clientId)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Box>

      {/* Add Item Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Client ID"
            fullWidth
            variant="outlined"
            value={newItem.clientId}
            onChange={(e) =>
              setNewItem({ ...newItem, clientId: e.target.value })
            }
          />
          <MuiTextField
            margin="dense"
            label="Item Type"
            fullWidth
            variant="outlined"
            value={newItem.itemType}
            onChange={(e) =>
              setNewItem({ ...newItem, itemType: e.target.value })
            }
          />
          <MuiTextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                quantity: parseInt(e.target.value) || 1,
              })
            }
          />
          <MuiTextField
            margin="dense"
            label="Characteristics (JSON)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={JSON.stringify(newItem.characteristics || {})}
            onChange={(e) => {
              try {
                const characteristics = JSON.parse(e.target.value);
                setNewItem({ ...newItem, characteristics });
              } catch {
                // Invalid JSON, keep the old value
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <MuiTextField
                autoFocus
                margin="dense"
                label="Client ID"
                fullWidth
                variant="outlined"
                disabled
                value={selectedItem.clientId}
              />
              <MuiTextField
                margin="dense"
                label="Item Type"
                fullWidth
                variant="outlined"
                value={selectedItem.itemType}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, itemType: e.target.value })
                }
              />
              <MuiTextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={selectedItem.quantity}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
              />
              <MuiTextField
                margin="dense"
                label="Characteristics (JSON)"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={JSON.stringify(selectedItem.characteristics || {})}
                onChange={(e) => {
                  try {
                    const characteristics = JSON.parse(e.target.value);
                    setSelectedItem({ ...selectedItem, characteristics });
                  } catch {
                    // Invalid JSON, keep the old value
                  }
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Show>
  );
};
