import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { People } from "./pages/People";
import { Footer } from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="people" element={<People />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
