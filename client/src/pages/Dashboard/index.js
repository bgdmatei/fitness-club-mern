import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import moment from "moment";
import "./dashboard.css";
import {
  Button,
  ButtonGroup,
  Alert,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [eventRequestMessage, setEventRequestMessage] = useState("");
  const [eventRequestSuccess, setEventRequestSuccess] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

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

  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/approvals`,
        {},
        { headers: { user } }
      );
      setEventRequestSuccess(true);
      setEventRequestMessage("Event approved successfully!");
      removeNotificationFromDashboard(eventId);
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/rejections`,
        {},
        { headers: { user } }
      );
      setEventRequestSuccess(true);
      setEventRequestMessage("Event declined successfully!");
      removeNotificationFromDashboard(eventId);
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const removeNotificationFromDashboard = (eventId) => {
    const newEvent = eventsRequest.filter((event) => event._id !== eventId);
    setEventsRequest(newEvent);
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
                <Button
                  color="success"
                  onClick={() => acceptEventHandler(request._id)}
                >
                  Accept
                </Button>
                <Button
                  color="danger"
                  onClick={() => rejectEventHandler(request._id)}
                >
                  Decline
                </Button>
              </ButtonGroup>
            </li>
          );
        })}
      </ul>
      {eventRequestSuccess ? (
        <Alert color="success"> {eventRequestMessage}</Alert>
      ) : (
        ""
      )}
      <div className="filter-panel">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary" caret size="sm">
            Filter
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => filterHandler(null)}
              active={rSelected === null}
            >
              {" "}
              All sports
            </DropdownItem>
            <DropdownItem
              onClick={myEventsHandler}
              active={rSelected === "myevents"}
            >
              My events
            </DropdownItem>
            <DropdownItem
              onClick={() => filterHandler("Running")}
              active={rSelected === "Running"}
            >
              Running
            </DropdownItem>
            <DropdownItem
              onClick={() => filterHandler("Football")}
              active={rSelected === "Football"}
            >
              Football
            </DropdownItem>
            <DropdownItem
              onClick={() => filterHandler("Tennis")}
              active={rSelected === "Tennis"}
            >
              Tennis
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
            <span>
              <b>Event date:</b> {moment(event.date).format("l")}
            </span>
            <span>
              <b>Price:</b> £{parseFloat(event.price).toFixed(2)}
            </span>
            <span>
              <b>Description:</b> {event.description}
            </span>
            <br />
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
