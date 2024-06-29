import { createRoot } from "react-dom/client";
import App from "./components/JSX/App.jsx";
import "../styles.css"; //might need to add this to any folder that i want to use tailwindcss in NOT WORKING RN task 6/28

const root = createRoot(document.getElementById("root"));
root.render(<App />);
