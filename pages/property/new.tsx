import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import styles from '../../styles/Home.module.css';
import DollarInput from '../dollarInput';

export default function Home() {
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [applicationFee, setApplicationFee] = useState("");
  const [reservationFee, setReservationFee] = useState("");
  const [adminFee, setAdminFee] = useState("");
  const [parkingFee, setParkingFee] = useState("");
  const [petFee, setPetFee] = useState("");

  const [customText, setCustomText] = useState("");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setLoading(true);
      await fetch("/api/addProperty", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          address,
          city,
          state,
          zip,
          applicationFee,
          reservationFee,
          adminFee,
          parkingFee,
          petFee,
          customText,
        }),
      });
      setLoading(false);
      router.push("/");
    }
  }

  return (
    <div className={styles.container}>
      <h3>Add Property</h3>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <h4>Location</h4>
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
          ></Form.Control>

          <Form.Label>City</Form.Label>
          <Form.Control
            required
            value={city}
            onChange={e => setCity(e.target.value)}
          ></Form.Control>

          <Form.Label>State</Form.Label>
          <Form.Control
            required
            value={state}
            onChange={e => setState(e.target.value)}
          ></Form.Control>

          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            required
            value={zip}
            onChange={e => setZip(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <h4>Fees</h4>
          <Form.Label>Application Fee</Form.Label>
          <DollarInput value={applicationFee} setValue={setApplicationFee} />

          <Form.Label>Reservation Fee</Form.Label>
          <DollarInput value={reservationFee} setValue={setReservationFee} />

          <Form.Label>Admin/amenity Fee</Form.Label>
          <DollarInput value={adminFee} setValue={setAdminFee} />

          <Form.Label>Parking Fee</Form.Label>
          <DollarInput value={parkingFee} setValue={setParkingFee} />

          <Form.Label>Pet Fee</Form.Label>
          <DollarInput value={petFee} setValue={setPetFee} />
        </Form.Group>

        <Form.Group>
          <h4>Customizations</h4>

          <Form.Label>Custom Text</Form.Label>
          <Form.Control
            value={customText}
            as="textarea"
            onChange={e => setCustomText(e.target.value)}
          ></Form.Control>
          Need more customizations? Contact us at <a href="mailto:hello@meetginny.com">hello@meetginny.com</a>.
        </Form.Group>

        <Button type="submit">
          Save
          {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>


    </div>
  );
}
