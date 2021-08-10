import React from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import styles from '../styles/PropertyForm.module.css';
import Image from 'next/image';
import DollarInput from './dollarInput';

export interface Property {
  logo:string;
  id?: string;
  logo_url?: File;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  application_fee?: number;
  reservation_fee?: number;
  admin_fee?: number;
  trash_fee?: number;
  custom_text?: string;
}

interface PropertyFormProps {
  property: Property;
  update: (u: Partial<Property>) => void;
  logoHandler: (f: File) => void;
  loading: boolean;
  validated: boolean;
  handleSubmit: (e: any) => void;
}

export default function PropertyForm(props: PropertyFormProps) {
  return (
    <Form noValidate validated={props.validated} onSubmit={props.handleSubmit}>
      <h4>Logo</h4>
      <Form.Group controlId="formFile" className="mb-3">
        {props.property.logo_url && <div className={styles.logoImage} >
          <Image
            src={"https://storage.googleapis.com/bmi-templates/" + props.property.logo_url}
            alt="Logo image"
            layout="fill"
            objectFit="contain"
          />
        </div>}
        <Form.Label>Upload an Image</Form.Label>
        <Form.Control type="file" accept="image/*"
          onChange={(e: any) => {
            props.logoHandler(e.target.files[0])
          }} />
      </Form.Group>
      <h4>Location</h4>
      <Form.Group>
        <Form.Label>Street Address</Form.Label>
        <Form.Control
          required
          value={props.property.address}
          onChange={e => props.update({ address: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>City</Form.Label>
        <Form.Control
          required
          value={props.property.city}
          onChange={e => props.update({ city: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>State</Form.Label>
        <Form.Control
          required
          value={props.property.state}
          onChange={e => props.update({ state: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Zip Code</Form.Label>
        <Form.Control
          required
          value={props.property.zip}
          onChange={e => props.update({ zip: e.target.value })}
        ></Form.Control>
      </Form.Group>

      <h4>Fees</h4>
      <Form.Group>
        <Form.Label>Application Fee</Form.Label>
        <DollarInput value={props.property.application_fee} setValue={v => props.update({ application_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Reservation Fee</Form.Label>
        <DollarInput value={props.property.reservation_fee} setValue={v => props.update({ reservation_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Admin/Amenity Fee</Form.Label>
        <DollarInput value={props.property.admin_fee} setValue={v => props.update({ admin_fee: Number(v) })} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Trash Fee</Form.Label>
        <DollarInput value={props.property.trash_fee} setValue={v => props.update({ trash_fee: Number(v) })} />
      </Form.Group>

      <h4>Customizations</h4>
      <Form.Group>
        <Form.Label>Custom Text</Form.Label>
        <Form.Control
          value={props.property.custom_text}
          as="textarea"
          rows={6}
          onChange={e => props.update({ custom_text: e.target.value })}
        />
      </Form.Group>

      <Form.Group>
        Need more customizations? Contact us at <a href="mailto:hello@tryginny.com">hello@tryginny.com</a>.
      </Form.Group>

      <Button type="submit">
        Save
        {props.loading && <Spinner style={{ marginLeft: "10px" }} as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      </Button>

    </Form>
  );
}
