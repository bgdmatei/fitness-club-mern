import React, { useState } from "react";
import api from "../../services/api";
import { Button, Form, FormGroup, Input, Container, Label } from "reactstrap";
import cameraIcon from "../../assets/camera.png";

export default function EventsPage() {
  const user_id = localStorage.getItem("user");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [date, setDate] = useState("");

  const submitHandler = () => {
    return "";
  };

  return (
    <Container>
      <h1>Hello from EventsPage</h1>
      <Form onSubmit={submitHandler}>
        <Label>Upload image:</Label>
        <Input
          id="thumbnail"
          type="file"
          onChange={(evt) => setThumbnail(evt.target.files[0])}
        />
        <img
          src={cameraIcon}
          style={{ maxWidth: "50px" }}
          alt="upload icon image"
        />
      </Form>
    </Container>
  );
}
