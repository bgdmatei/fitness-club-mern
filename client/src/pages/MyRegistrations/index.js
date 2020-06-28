import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function MyRegistrations() {
  const [myEvents, setMyEvents] = useState([]);
  const user = localStorage.getItem("user");

  useEffect(() => {
    getMyEvents();
  });

  const getMyEvents = async () => {
    try {
      const response = await api.get("registration", { headers: { user } });
      console.log(response.data);
    } catch (error) {}
  };

  return <div> My Registrations component</div>;
}
