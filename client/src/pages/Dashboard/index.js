import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import moment from "moment";
import "./dashboard.css";
import { Button, ButtonGroup, Alert } from "reactstrap";
import socketio from "socket.io-client";

export default function Dashboard({ history }) {
  const [events, setEvents] = useState([]);
  const user = localStorage.getItem("user");
  const user_id = localStorage.getItem("user_id");
  const [rSelected, setRSelected] = useState(null);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [eventsRequest, setEventsRequest] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const socket = useMemo(
    () => socketio("http://localhost:8000", { query: { user: user_id } }),
    [user_id]
  );

  useEffect(() => {
    socket.on("registration_request", (data) =>
      setEventsRequest([...eventsRequest, data])
    );
  }, [eventsRequest, socket]);

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query);
  };

  const myEventsHandler = async () => {
    try {
      setRSelected("myevents");
      const response = await api.get("/user/events", {
        headers: { user: user },
      });
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const getEvents = async (filter) => {
    try {
      const url = filter ? `/dashboard/${filter}` : "/dashboard";
      const response = await api.get(url, { headers: { user: user } });

      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user: user } });
      setSuccess(true);
      setMessageHandler("Event was deleted successfully!");
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler("Error when deleting event!");
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const registrationRequestHandler = async (event) => {
    try {
      await api.post(`/registration/${event.id}`, {}, { headers: { user } });
      setSuccess(true);
      setMessageHandler(
        `You subscribed successfully to the ${event.title} event!`
      );
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler(`Error when subscribing to ${event.title} event`);
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };
  return (
    <>
      <ul className="notifications">
        {eventsRequest.map((request) => {
          return (
            <li key={request._id}>
              <div>
                <strong>{request.user.email}</strong> is requesting to subscribe
                to <strong>{request.event.title}</strong> event!
              </div>
              <ButtonGroup>
                <Button color="success" onClick={() => {}}>
                  Accept
                </Button>
                <Button color="danger" onClick={() => {}}>
                  Decline
                </Button>
              </ButtonGroup>
            </li>
          );
        })}
      </ul>
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
            <Button
              color="primary"
              onClick={() => registrationRequestHandler(event)}
            >
              Subscribe
            </Button>
          </li>
        ))}
      </ul>
      {error ? (
        <Alert className="event-validation" color="danger">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
    </>
  );
}
