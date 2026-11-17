import { createRoot } from "react-dom/client";
import { Flag } from "@johnmorrisdotca/hata/react";

createRoot(document.getElementById("root")!).render(<Flag code="JP-13" shape="round" size="large" label="Tokyo" border />);
