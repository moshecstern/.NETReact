import React, { useContext } from 'react'
import { FORM_ERROR } from "final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../common/form/TextInput";
import TextAreaInput from  "../../common/form/TextAreaInput";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from '../../common/form/ErrorMessage';
import { RootStoreContext } from "../../stores/rootStore";
import { IMessageUserFormValues } from "../../models/user";

const validate = combineValidators({
    email: isRequired("Email"),
    // displayName: isRequired("display name"),
    // username: isRequired("username"),
    title: isRequired("Title"),
    message: isRequired("Message"),
  });

const Contact = () => {
    const rootStore = useContext(RootStoreContext);
    const { sendMessage } = rootStore.userStore;
    return (
        <FinalForm
      onSubmit={(values: IMessageUserFormValues) =>
        sendMessage(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtyFieldsSinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Contact Us"
            color="grey"
            textAlign="center"
          />
          {/* <Field name="username" component={TextInput} placeholder="Username" /> */}
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field name="title" component={TextInput} placeholder="Title" />
          <Field
            name="message"
            component={TextAreaInput}
            placeholder="Message"
            type="message"
          />
          {submitError && !dirtyFieldsSinceLastSubmit && (
            <ErrorMessage
                error={submitError}
                text='Please fill out all fields'
            />
            // )}
            // <Label color="red" basic content={submitError.statusText} />
          )}

          <br />
             <Button
            disabled={(invalid && !dirtyFieldsSinceLastSubmit) || pristine}
            color="grey"
            fluid
            loading={submitting}
            // positive
            content="Send Message"
          />
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
    )
}

export default Contact
