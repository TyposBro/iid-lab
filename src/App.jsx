import { Router } from "./router";
import "./index.css";
import "./styles/nav.scss";
export const App = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Router />
    </div>
  );
};

export default App;
