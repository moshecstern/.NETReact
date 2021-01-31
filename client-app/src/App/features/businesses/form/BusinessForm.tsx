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
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 charectors'})
  )(),
  city: isRequired('City'),
  // venue: isRequired('Venue'),
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
    deletebusiness
  } = rootStore.businessStore;

  const [business, setBusiness] = useState(new BusinessFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadbusiness(match.params.id)
        .then(business => {
          setBusiness(new BusinessFormValues(business));
        })
        .finally(() => setLoading(false));
    }
  }, [loadbusiness, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    // const dateAndTime = combineDateAndTime( Date,Date;
    const { date, time, ...business } = values;
    business.date = dateAndTime;
    // const {...business } = values;
    // business.date = new Date(Date.now());
    // Business.isService = false;

    if (!business.id) {
      let newBusiness = {
        ...business,
        id: uuid(),
      };
      createbusiness(newBusiness);
    } else {
      editbusiness(business);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={business}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={business.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={business.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={category}
                  value={business.category}
                  component={SelectInput}
                />
                <Form.Group width="equal">
                  <Field
                    name="street"
                    placeholder="Street"
                    value={business.street}
                    component={TextInput}
                  />
                     <Field
                    name="city"
                    placeholder="City"
                    value={business.city}
                    component={TextInput}
                  />
                  <Field
                    name="state"
                    placeholder="State"
                    value={business.state}
                    component={TextInput}
                  />
                </Form.Group>
                <Field
                    name="website"
                    placeholder="Website"
                    value={business.website}
                    component={TextInput}
                  />
                   <Field
                    name="image"
                    placeholder="Image"
                    value={business.image}
                    component={TextInput}
                  />
                <Form.Group width="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={business.date}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="time"
                    placeholder="Time"
                    value={business.time}
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
                         <Field
                  name="hours"
                  placeholder="Hours"
                  value={business.hours}
                  rows={2}
                  component={TextAreaInput}
                />
                    <Field
                  name="featuredPost"
                  placeholder="FeaturedPost"
                  value={business.featuredPost}
                  rows={3}
                  component={TextAreaInput}
                />
                <Button
                  loading={submittingBusiness}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={business.id ? () => history.push(`/businesses/${business.id}`) : () => history.push("/businesses")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
                    {business.id && 
                <Button
                 onClick={(e)=>deletebusiness(e,business.id!).then(()=> history.push('/businesses'))}
                 
                 disabled={loading}
                 floated="right"
                 type="button"
                 content="Delete"
                />
                }
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(BusinessForm);
