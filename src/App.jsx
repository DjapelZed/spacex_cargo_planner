import { Routes, Route } from "react-router-dom";

import MainPage from "./pages/main-page";
import ShipmentInfo from "./pages/main-page/components/shipment-info";
import "./resources/main.scss"

const App = () => {
    return <Routes>
        <Route path="/" element={<MainPage/>}>
            <Route index element={<ShipmentInfo/>}/>
            <Route path=":name" element={<ShipmentInfo/>}/>
        </Route>
    </Routes>
}

export default App;