import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import VerifyOTP from "./components/VerifyOTP";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import SellEaseLanding from "./components/landing";
import AboutPage from "./components/about";
import Contact from "./components/ContactPage";
import Sell from "./components/sell";
import History from "./components/history";
import  Buy from "./components/buy";
import  Chat from "./components/chatpage";
import  Messages from "./components/messages";
const App = () => {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<SellEaseLanding />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/landing" element={<SellEaseLanding />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/messages" element={<Messages />} />
            </Routes>
        </Router>
    );
};

export default App;
