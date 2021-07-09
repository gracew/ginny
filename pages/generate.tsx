import moment from 'moment';
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import DollarInput from './dollarInput';

export default function GenerateReservationAgreement() {
  const [aptNo, setAptNo] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [petRent, setPetRent] = useState("");
  const [parkingFee, setParkingFee] = useState("");
  const [moveInDate, setMoveInDate] = useState(moment().format("yyyy-MM-DD"));

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState();

  async function handleSubmit(e: any) {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ aptNo, monthlyRent, parkingFee, petFee: petRent, moveInDate })
      })
      const parsed = await res.json();
      setDownloadUrl(parsed.downloadUrl);
      setLoading(false);
    }
  }

  return (
    <div>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Label>Apartment #</Form.Label>
        <Form.Control
          required
          value={aptNo}
          onChange={e => setAptNo(e.target.value)}
        ></Form.Control>

        <Form.Label>Monthly Rent</Form.Label>
        <DollarInput value={monthlyRent} setValue={setMonthlyRent} />

        <Form.Label>Move-in Date</Form.Label>
        <Form.Control
          required
          type="date"
          value={moveInDate}
          onChange={e => setMoveInDate(e.target.value)}
        ></Form.Control>

        <Form.Label>Monthly Pet Rent (optional)</Form.Label>
        <DollarInput value={petRent} setValue={setPetRent} />

        <Form.Label>Parking Fee (optional)</Form.Label>
        <DollarInput value={parkingFee} setValue={setParkingFee} />

        <Button type="submit">
          Generate!
          {loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>

      {downloadUrl && <Button href={downloadUrl}>Download</Button>}
    </div>
  )
}
