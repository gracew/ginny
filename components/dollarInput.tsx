import React from 'react';
import { InputGroup } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input-field';

interface DollarInputProps {
  value?: string | number;
  setValue: (v: string) => void;
}

export default function DollarInput(props: DollarInputProps) {
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup.Prepend>
      <CurrencyInput className="form-control" value={props.value || ""} onValueChange={v => props.setValue(v || "")} />
    </InputGroup>
  )
}
