import {
  Create,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FilterButton,
  List,
  NumberField,
  NumberInput,
  SelectInput,
  Show,
  SimpleForm,
  TabbedShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  useRecordContext,
} from "react-admin";

// GameSave property filters matching Java Filter structure
const GameSaveFilters = [
  <TextInput key="id" label="ID" source="filters.id" />,
  <TextInput key="nickname" label="Nickname" source="filters.nickname" />,
  <TextInput key="userEmai" label="User Email" source="filters.userEmail" />,
  <SelectInput
    key="enabled"
    label="Enabled"
    source="filters.enabled"
    choices={[
      { id: "true", name: "Enabled" },
      { id: "false", name: "Disabled" },
    ]}
  />,
];

const GameSaveListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const GameSaveShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const GameSaveList = () => (
  <List actions={<GameSaveListActions />} filters={GameSaveFilters}>
    <Datagrid rowClick="show">
      <TextField source="metadata.id" label="ID" />
      <TextField source="metadata.nickname" label="Nickname" />
      <TextField source="metadata.userEmail" label="User Email" />
      <NumberField source="currency.gold" label="Gold" />
      <NumberField source="currency.diamond" label="Diamond" />
      <NumberField source="currency.emerald" label="Emerald" />
      <NumberField source="currency.amethyst" label="Amethyst" />
      <NumberField source="characteristics.attack" label="Attack" />
      <NumberField source="characteristics.health" label="Health" />
      <NumberField source="characteristics.critChance" label="Crit Chance" />
      <NumberField source="characteristics.critDamage" label="Crit Damage" />
      <NumberField source="characteristics.resistance" label="Resistance" />
      <NumberField source="stage.maxStage" label="Max Stage" />
      <NumberField source="stage.currentStage" label="Current Stage" />
      <NumberField source="stage.wave" label="Wave" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const GameSaveCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="username" required />
      <NumberInput source="gold" defaultValue={0} />
      <NumberInput source="healthPoints" defaultValue={100} />
      <NumberInput source="attack" defaultValue={10} />
    </SimpleForm>
  </Create>
);

export const GameSaveEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" required />
      <NumberInput source="gold" />
      <NumberInput source="healthPoints" />
      <NumberInput source="attack" />
    </SimpleForm>
  </Edit>
);

const GameSaveTitle = () => {
  const record = useRecordContext();
  return <span>{record ? "Game Save ID: " + record.id : ""}</span>;
};

export const GameSaveShow = () => (
  <Show actions={<GameSaveShowActions />} title={<GameSaveTitle />}>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="Metadata">
        <div>METADATA</div>
        <TextField source="metadata.id" />
        <TextField source="metadata.nickname" />
        <TextField source="metadata.userEmail" />
        <DateField source="metadata.createdAt" showTime />
        <DateField source="metadata.updatedAt" showTime />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Currency">
        <TextField source="currency.gold" />
        <TextField source="currency.diamond" />
        <TextField source="currency.emerald" />
        <TextField source="currency.amethyst" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Stage">
        <TextField source="stage.maxStage" />
        <TextField source="stage.currentStage" />
        <TextField source="stage.wave" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Characteristics">
        <TextField source="characteristics.attack" />
        <TextField source="characteristics.health" />
        <TextField source="characteristics.critChance" />
        <TextField source="characteristics.critDamage" />
        <TextField source="characteristics.resistance" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Inventory">INVENTORY</TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);
