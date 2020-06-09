import React, { useEffect, useState } from "react";
import api from "../../services/api";
import moment from "moment";
import "./dashboard.css";
import { Button, ButtonGroup } from "reactstrap";

export default function Dashboard({ history }) {
  const [events, setEvents] = useState([]);
  const user_id = localStorage.getItem("user");
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);

  useEffect(() => {
    getEvents();
  }, []);

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query);
  };

  const myEventsHandler = async () => {
    setRSelected("myevents");
    const response = await api.get("/user/events", { headers: { user_id } });
    setEvents(response.data);
  };

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : "/dashboard";
    const response = await api.get(url, { headers: { user_id } });

    setEvents(response.data);
  };

  const deleteEventHandler = async (eventId) => {
    const deleteEvent = await api.delete(`/event/${eventId}`);
  };
  return (
    <>
      <div className="filter-panel">
        <ButtonGroup>
          <Button
            color="primary"
            onClick={() => filterHandler(null)}
            active={rSelected === null}
          >
            All sports
          </Button>
          <Button
            color="primary"
            onClick={myEventsHandler}
            active={rSelected === "myevents"}
          >
            My Events
          </Button>
          <Button
            color="primary"
            onClick={() => filterHandler("Running")}
            active={rSelected === "Running"}
          >
            Running
          </Button>
          <Button
            color="primary"
            onClick={() => filterHandler("Football")}
            active={rSelected === "Football"}
          >
            Football
          </Button>
          <Button
            color="primary"
            onClick={() => filterHandler("Tennis")}
            active={rSelected === "Tennis"}
          >
            Tennis
          </Button>
        </ButtonGroup>
        <Button color="secondary" onClick={() => history.push("events")}>
          Events
        </Button>
      </div>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id}>
            <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
              {event.user === user_id ? (
                <div>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => deleteEventHandler(event._id)}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                ""
              )}
            </header>
            <strong>{event.title}</strong>
            <span>Event date:{moment(event.date).format("l")}</span>
            <span>Price:£{parseFloat(event.price).toFixed(2)}</span>
            <span>Description:{event.description}</span>
            <Button color="primary">Subscribe</Button>
          </li>
        ))}
      </ul>
    </>
  );
}
