import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import {experienceFormValues} from "../../../models/experience";
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
    // venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time'),
  })

  interface DetailParams {
    id: string;
  }

  const ExperienceForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history,
  }) => {
    const rootStore = useContext(RootStoreContext);
    const {
      createExperience,
      editExperience,
      submitting,
      loadExperience,
      deleteExperience
    } = rootStore.experienceStore;
  
    const [experience, setExperience] = useState(new experienceFormValues());
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (match.params.id) {
        setLoading(true);
        loadExperience(match.params.id)
          .then(experience => {
            setExperience(new experienceFormValues(experience));
          })
          .finally(() => setLoading(false));
      }
    }, [loadExperience, match.params.id]);
  
    const handleFinalFormSubmit = (values: any) => {
      const dateAndTime = combineDateAndTime(values.date, values.time);
      const { date, time, ...experience } = values;
      experience.date = dateAndTime;
  
      if (!experience.id) {
        let newExperience = {
          ...experience,
          id: uuid(),
        };
        createExperience(newExperience);
      } else {
        editExperience(experience);
      }
    };
  
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment clearing>
            <FinalForm
            validate={validate}
              initialValues={experience}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} loading={loading}>
                  <Field
                    name="title"
                    placeholder="Title"
                    value={experience.title}
                    component={TextInput}
                  />
                  <Field
                    name="description"
                    placeholder="Description"
                    value={experience.description}
                    rows={3}
                    component={TextAreaInput}
                  />
                    <Field
                    name="main"
                    placeholder="Main"
                    value={experience.main}
                    rows={3}
                    component={TextAreaInput}
                  />
                     <Field
                    name="main2"
                    placeholder="Main2"
                    value={experience.main2}
                    rows={3}
                    component={TextAreaInput}
                  />
                     <Field
                    name="skills"
                    placeholder="Skills"
                    value={experience.skills}
                    rows={3}
                    component={TextAreaInput}
                  />
                  
                  <Field
                    name="category"
                    placeholder="Category"
                    options={category}
                    value={experience.category}
                    component={SelectInput}
                  />
                  <Form.Group width="equal">
                    <Field
                      name="date"
                      placeholder="Date"
                      value={experience.date}
                      component={DateInput}
                      date={true}
                    />
                    <Field
                      name="time"
                      placeholder="Time"
                      value={experience.time}
                      component={DateInput}
                      time={true}
                    />
                  </Form.Group>
                  <Form.Group width="equal">
                  <Field
                    name="link1"
                    placeholder="Link1"
                    value={experience.link1}
                    component={TextInput}
                  />
                   <Field
                    name="link1Name"
                    placeholder="Link1Name"
                    value={experience.link1Name}
                    component={TextInput}
                  />
                  </Form.Group>
                  <Form.Group width="equal">
                  <Field
                    name="link2"
                    placeholder="Link2"
                    value={experience.link2}
                    component={TextInput}
                  />
                   <Field
                    name="link2Name"
                    placeholder="Link2Name"
                    value={experience.link2Name}
                    component={TextInput}
                  />
                  </Form.Group>
                  <Form.Group width="equal">
                  <Field
                      name="dateStarted"
                      placeholder="DateStarted"
                      value={experience.dateStarted}
                      component={DateInput}
                      date={true}
                    />
                     <Field
                      name="dateEnded"
                      placeholder="DateEnded"
                      value={experience.dateEnded}
                      component={DateInput}
                      date={true}
                    />
                    </Form.Group>



                  <Field
                    name="city"
                    component={TextInput}
                    placeholder="City"
                    value={experience.city}
                  />
                  <Field
                    name="image"
                    placeholder="Image"
                    value={experience.image}
                    component={TextInput}
                  />
                  <Button
                    loading={submitting}
                    disabled={loading || invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
                    onClick={experience.id ? () => history.push(`/experiences/${experience.id}`) : () => history.push("/experiences")}
                    disabled={loading}
                    floated="right"
                    type="button"
                    content="Cancel"
                  />
                      {experience.id && 
                <Button
                 onClick={(e)=>deleteExperience(e,experience.id!).then(()=> history.push('/experiences'))}
                 
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
  
  export default observer(ExperienceForm);