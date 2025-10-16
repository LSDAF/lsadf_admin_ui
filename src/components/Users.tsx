import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  Edit,
  Show,
  SimpleShowLayout,
  TopToolbar,
  ExportButton,
  CreateButton,
  useRecordContext,
  FilterButton,
  SelectInput,
} from "react-admin";

// User property filters matching Java Filter structure
const UserFilters = [
  <TextInput key="id" source="filters.id" label="ID" />,
  <TextInput key="username" label="Username" source="filters.username" />,
  <TextInput key="first_name" label="First Name" source="filters.firstName" />,
  <TextInput key="last_name" label="Last Name" source="filters.lastName" />,
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

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const UserShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

const UserTitle = () => {
  const record = useRecordContext();
  return <span>{record ? "User ID: " + record.username : ""}</span>;
};

export const UserList = () => (
  <List filters={UserFilters} actions={<UserListActions />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <BooleanField source="enabled" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UserShow = () => (
  <Show actions={<UserShowActions />} title={<UserTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <BooleanField source="enabled" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" type="email" required />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <BooleanInput source="enabled" defaultValue={true} />
    </SimpleForm>
  </Create>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <BooleanInput source="enabled" />
    </SimpleForm>
  </Edit>
);
