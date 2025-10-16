import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  Edit,
  TopToolbar,
  ExportButton,
  FilterButton,
  CreateButton,
} from 'react-admin';

const GameSaveListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const GameSaveList = () => (
  <List actions={<GameSaveListActions />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <NumberField source="gold" />
      <NumberField source="healthPoints" />
      <NumberField source="attack" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
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
