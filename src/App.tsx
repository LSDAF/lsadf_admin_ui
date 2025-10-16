import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./auth/keycloakAuthProvider";
import { Layout } from "./Layout";
import { UserList, UserShow, UserCreate, UserEdit } from "./components/Users";
import {
  GameSaveList,
  GameSaveCreate,
  GameSaveEdit,
} from "./components/GameSaves";
import { GameSaveShow } from "./components/GameSaveShow";
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
