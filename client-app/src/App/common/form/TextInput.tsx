import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";


    interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps { }

const TextInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} width={width} type={type}>
      <input {...input} placeholder={placeholder} />
      {touched && error && (
          <Label basic color='red'>
              {error}
          </Label>
      )}
    </Form.Field>
  );
};

export default TextInput;
