import {
  Create,
  CreateButton,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FilterButton,
  List,
  NumberField,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
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
    {<FilterButton />}
    <CreateButton />
    <ExportButton />
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
