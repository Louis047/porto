import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QRPage from "./QRPage"; 
import { Link } from "react-router-dom";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="flex flex-col items-center justify-center min-h-screen">
                            <h1 className="text-3xl font-bold mb-4">Welcome to Porto</h1>
                            <Link to="/qr">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Generate QR Code
                                </button>
                            </Link>
                        </div>
                    }
                />
                <Route path="/qr" element={<QRPage />} />
            </Routes>
        </Router>
    );
};

export default App;
