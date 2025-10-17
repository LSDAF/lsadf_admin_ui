import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./auth/keycloakAuthProvider";
import { Layout } from "./Layout";
import { UserCreate, UserEdit, UserList, UserShow } from "./components/Users";
import {
  GameSaveCreate,
  GameSaveEdit,
  GameSaveList,
  GameSaveShow,
} from "./components/GameSaves";
import PersonIcon from "@mui/icons-material/Person";
import GamepadIcon from "@mui/icons-material/Gamepad";

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    layout={Layout}
  >
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      create={UserCreate}
      edit={UserEdit}
      icon={PersonIcon}
    />
    <Resource
      name="gameSaves"
      list={GameSaveList}
      show={GameSaveShow}
      create={GameSaveCreate}
      edit={GameSaveEdit}
      icon={GamepadIcon}
    />
  </Admin>
);

export default App;
