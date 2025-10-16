import {
  List,
  Datagrid,
  TextField,
  EmailField,
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
} from "react-admin";

const UserListActions = () => (
  <TopToolbar>
    {/*<FilterButton />*/}
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
  <List actions={<UserListActions />}>
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
