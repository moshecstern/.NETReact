import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../common/form/TextInput";
import { Form, Button, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import { IUserFormValues } from "../../Models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from '../../common/form/ErrorMessage';
import { observer } from "mobx-react-lite";

const validate = combineValidators({
  email: isRequired("Email"),
  password: isRequired("Password"),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
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
        <Form onSubmit={handleSubmit} error autoComplete='off'>
          <Header
            as="h2"
            content="Login to Our App"
            color="teal"
            textAlign="center"
          />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtyFieldsSinceLastSubmit && (
            
            <ErrorMessage
                error={submitError}
                text='Invalid email or password'
            />
          )}

          <br />
             <Button
            disabled={(invalid && !dirtyFieldsSinceLastSubmit) || pristine}
            color="teal"
            fluid
            loading={submitting}
            positive
            content="Login"
          />
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
