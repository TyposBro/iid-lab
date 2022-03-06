import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { People } from "./pages/People";
import { Footer } from "./components/Footer";
function App() {
  return (
    <div className="App">
      <Header></Header>
      {/* <Home></Home> */}
      <People></People>
      <Footer></Footer>
    </div>
  );
}

export default App;
