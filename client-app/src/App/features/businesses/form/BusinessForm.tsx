import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import {BusinessFormValues} from "../../../models/business";
import { v4 as uuid } from "uuid";
// import LoadingComponent from "../../../../LoadingComponent";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../common/form/TextInput";
import TextAreaInput from "../../../common/form/TextAreaInput";
import SelectInput from "../../../common/form/SelectInput";
import DateInput from "../../../common/form/DateInput";

import { category } from "../../../common/options/categoryOptions";
import { combineDateAndTime } from "../../../common/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';
import { RootStoreContext } from "../../../stores/rootStore";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description nneds to be at least 5 charectors'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
})


interface DetailParams {
  id: string;
}

const BusinessForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createbusiness,
    editbusiness,
    submittingBusiness,
    loadbusiness,
  } = rootStore.businessStore;

  const [Business, setBusiness] = useState(new BusinessFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadbusiness(match.params.id)
        .then(Business => {
          setBusiness(new BusinessFormValues(Business));
        })
        .finally(() => setLoading(false));
    }
  }, [loadbusiness, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...Business } = values;
    Business.date = dateAndTime;

    if (!Business.id) {
      let newBusiness = {
        ...Business,
        id: uuid(),
      };
      createbusiness(newBusiness);
    } else {
      editbusiness(Business);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={Business}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={Business.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={Business.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={category}
                  value={Business.category}
                  component={SelectInput}
                />
                <Form.Group width="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={Business.time}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="date"
                    placeholder="Time"
                    value={Business.date}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group>
                {/* <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={Business.city}
                /> */}
                {/* <Field
                  name="venue"
                  placeholder="Venue"
                  value={Business.venue}
                  component={TextInput}
                /> */}
                <Button
                  loading={submittingBusiness}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={Business.id ? () => history.push(`/businesses/${Business.id}`) : () => history.push("/businesses")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(BusinessForm);
