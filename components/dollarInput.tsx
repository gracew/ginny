import React from 'react';
import { InputGroup } from 'react-bootstrap';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';

interface DollarInputProps {
  value?: string | number;
  setValue: (v: string) => void;
}

export default function DollarInput(props: CurrencyInputProps & DollarInputProps) {
  const { value, setValue, ...otherProps } = props;
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>$</InputGroup.Text>
      </InputGroup.Prepend>
      <CurrencyInput
        {...otherProps}
        className="form-control"
        value={props.value || ""}
        onValueChange={v => props.setValue(v || "")}
      />
    </InputGroup>
  )
}
