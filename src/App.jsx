import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { People } from "./pages/People";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Members } from "./components/Members";
import PEOPLE from "./people.json";

function App() {
  const members = Object.keys(PEOPLE);
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate replace to={"home"} />}></Route>
        <Route path="/home" element={<Home />} />

        <Route path="people" element={<People />}>
          <Route index element={<Navigate replace to={members[0]} />}></Route>
          {members.map((m) => (
            <Route key={m} path={m} element={<Members link={m} />}></Route>
          ))}
        </Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
