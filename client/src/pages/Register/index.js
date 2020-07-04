import React, { useState, useContext } from "react";
import api from "../../services/api";
import { UserContext } from "../../user-context";
import { Button, Form, FormGroup, Input, Container, Alert } from "reactstrap";

export default function Register({ history }) {
  const { setIsLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (
      email !== "" &&
      password !== "" &&
      firstName !== "" &&
      lastName !== ""
    ) {
      const response = await api.post("/user/register", {
        email,
        password,
        firstName,
        lastName,
      });
      const user = response.data.user || false;
      const user_id = response.data.user_id || false;

      if (user && user_id) {
        localStorage.setItem("user", user);
        localStorage.setItem("user_id", user_id);
        setIsLoggedIn(true);
        history.push("/");
      } else {
        const { message } = response.data;
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000);
      }
    } else {
      setError(true);
      setErrorMessage("Missing required fields!");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <div className="input-group">
          <FormGroup className="mb-2  mb-sm-0">
            <Input
              type="text"
              name="secondName"
              id="secondName"
              placeholder="Your last name"
              onChange={(evt) => setLastName(evt.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-2  mb-sm-0">
            <Input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Your first name"
              onChange={(evt) => setFirstName(evt.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-2  mb-sm-0">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </FormGroup>
          <FormGroup className="mb-2  mb-sm-0">
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </FormGroup>
        </div>

        <Button className="submit-btn">Submit</Button>
        <FormGroup>
          <Button
            className="secondary-btn"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </FormGroup>

        {error ? (
          <Alert className="event-validation" color="danger">
            {errorMessage}
          </Alert>
        ) : (
          ""
        )}
      </Form>
    </Container>
  );
}
