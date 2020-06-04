import React, { useState, useMemo } from "react";
import api from "../../services/api";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Container,
  Label,
  Alert,
  DropdownItem,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import cameraIcon from "../../assets/camera.png";
import "./event.css";

export default function EventsPage({ history }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState("Sport");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const submitHandler = async (evt) => {
    evt.preventDefault();
    const user_id = localStorage.getItem("user");
    const eventData = new FormData();
    eventData.append("thumbnail", thumbnail);
    eventData.append("sport", sport);
    eventData.append("title", title);
    eventData.append("price", price);
    eventData.append("description", description);
    eventData.append("date", date);

    try {
      if (
        title !== "" &&
        description !== "" &&
        price !== "" &&
        sport !== "" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user_id } });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
        console.log("Missing required message");
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error);
    }
  };

  const sportEventHandler = (sport) => setSport(sport);

  return (
    <Container>
      <h1>Create an Event</h1>
      <Form onSubmit={submitHandler}>
        <div className="input-group">
          <FormGroup>
            <Label>Upload image:</Label>
            <Label
              id="thumbnail"
              style={{ backgroundImage: `url(${preview})` }}
              className={thumbnail ? "has-thumbnail" : ""}
            >
              <Input
                type="file"
                onChange={(evt) => setThumbnail(evt.target.files[0])}
              />
              <img
                src={cameraIcon}
                style={{ maxWidth: "50px" }}
                alt="upload icon image"
              />
            </Label>
          </FormGroup>
          <FormGroup></FormGroup>
          <FormGroup>
            <Label>Title:</Label>
            <Input
              id="title"
              type="text"
              value={title}
              placeholder={"Event title"}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Description:</Label>
            <Input
              id="description"
              type="text"
              value={description}
              placeholder={"Event description"}
              onChange={(evt) => setDescription(evt.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Event price:</Label>
            <Input
              id="price"
              type="text"
              value={price}
              placeholder={"Event price £0.00"}
              onChange={(evt) => setPrice(evt.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Event date:</Label>
            <Input
              id="date"
              type="date"
              value={date}
              placeholder={"Event date"}
              onChange={(evt) => setDate(evt.target.value)}
            />
          </FormGroup>
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
            <Button id="caret" value={sport} disabled>
              {sport}
            </Button>
            <DropdownToggle caret />
            <DropdownMenu>
              <DropdownItem onClick={() => sportEventHandler("Running")}>
                Running
              </DropdownItem>
              <DropdownItem onClick={() => sportEventHandler("Football")}>
                Football
              </DropdownItem>
              <DropdownItem onClick={() => sportEventHandler("Tennis")}>
                Tennis
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <FormGroup>
          <Button className="submit-btn" type="submit">
            Create event
          </Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/")}>
            Dashboard
          </Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert className="event-validation" color="danger">
          Missing required information
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert className="event-validation" color="success">
          Event was created successfully!
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
}
