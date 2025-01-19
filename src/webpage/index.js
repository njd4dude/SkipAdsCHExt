import { createRoot } from "react-dom/client";
import Test from "./components/Test.jsx";
import "../styles.css"; 

const root = createRoot(document.getElementById("root"));
root.render(<Test />);
