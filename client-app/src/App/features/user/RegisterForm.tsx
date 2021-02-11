import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../common/form/TextInput";
import { Form, Button, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import { IUserFormValues } from "../../models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from '../../common/form/ErrorMessage';

const validate = combineValidators({
  email: isRequired("Email"),
  displayName: isRequired("display name"),
  username: isRequired("username"),
  password: isRequired("Password"),
});


const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
            content="Sign Up to Our App"
            color="grey"
            textAlign="center"
          />
          <Field name="username" component={TextInput} placeholder="Username" />
          <Field name="displayName" component={TextInput} placeholder="Display Name" />
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
                text='Invalid email or password, Password must contain a lowercase & uppercase letter as well as a number and special character'
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
            content="Register"
          />
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
  );
};

export default RegisterForm;
