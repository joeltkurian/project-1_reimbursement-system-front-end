import { useState } from "react";
import EmployeePage from "./Components/Employee/employee-page";
import LoginPage from "./Components/Login/login-page";
import ManagerPage from "./Components/Manager/manager-page";


export default function App() {

  const [user, setUser] = useState({
    username: sessionStorage.getItem("username"),
    isManager: sessionStorage.getItem("isManager") === 'false' ? false : true
  });

  function setTheUser(newUser) {
    setUser(newUser);
  }

  function logout() {
    sessionStorage.clear();
    setUser({
      username: sessionStorage.getItem("username"),
      isManager: sessionStorage.getItem("isManager") === 'false' ? false : true
    });
  }

  return (<>{
    !user.username ?
      <LoginPage user={user} updateUser={setTheUser} /> :
      <>{
        user.isManager ?
          <ManagerPage /> : <EmployeePage />
      }<button className="Btn" onClick={logout}>Log Out</button></>
  }</>);
}
