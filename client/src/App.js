import {Route,Routes, BrowserRouter} from "react-router-dom"
import MainView from "./components/views/MainView/MainView";
import Chat_View from "./components/views/chat/chat_view";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/chat" element={<Chat_View />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
