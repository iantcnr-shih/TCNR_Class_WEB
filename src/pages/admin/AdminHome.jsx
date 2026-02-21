import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("news");
    }, [])
}

export default AdminHome;