import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import ContextProvider from "./Context";
import HeaderSection from "./header/HeaderSection";
import Homepage from "./Homepage";
import ManageSection from "./manage/ManageSection";

function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <HeaderSection />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/manage" element={<ManageSection />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
