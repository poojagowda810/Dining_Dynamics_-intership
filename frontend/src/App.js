import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import UserRoute from "./Modules/admin/Route/UserRoute";
import DeliveryRoute from "./Modules/delivery/Route/DeliveryRoute";
import { AuthProvider } from "./Modules/GlobalContext";

import AdminLogin from "./Modules/Auth/Login";
import DeliveryLogin from "./Modules/delivery/Auth/DeliveryLogin";

function App() {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />}/>
          <Route path="/delivery/login" element={<DeliveryLogin />}/>
          <Route path="/admin/*" element={<AdminRoute />}/>
          <Route path="/delivery/*" element={<DeliveryRoute />}/>
          <Route path="/*" element={<UserRoute />}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
