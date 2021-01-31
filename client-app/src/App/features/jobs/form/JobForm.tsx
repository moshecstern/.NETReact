import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import {JobFormValues} from "../../../models/jobs";
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
  // date: isRequired('Date'),
  // time: isRequired('Time'),
})


interface DetailParams {
  id: string;
}

const JobForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createJob,
    editJob,
    submittingJob,
    loadJob,
    deletejob
  } = rootStore.jobStore;

  const [job, setJob] = useState(new JobFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadJob(match.params.id)
        .then(job => {
          setJob(new JobFormValues(job));
        })
        .finally(() => setLoading(false));
    }
  }, [loadJob, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    // const dateAndTime = combineDateAndTime( new Date(Date.now()),new Date(Date.now()));
    const { date, time, ...job } = values;
    // const {...job} = values;
    job.date = dateAndTime;
    // job.date = new Date(Date.now());

    if (!job.id) {
      let newJob = {
        ...job,
        id: uuid(),
      };
      createJob(newJob);
    } else {
      editJob(job);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={job}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={job.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={job.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={category}
                  value={job.category}
                  component={SelectInput}
                />
                <Form.Group width="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={job.time}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="timr"
                    placeholder="Time"
                    value={job.time}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group>
                <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={job.city}
                />
                {/* <Field
                  name="venue"
                  placeholder="Venue"
                  value={job.venue}
                  component={TextInput}
                /> */}
                <Button
                  loading={submittingJob}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={job.id ? () => history.push(`/jobs/${job.id}`) : () => history.push("/jobs")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
                    {job.id && 
                <Button
                 onClick={(e)=>deletejob(e,job.id!).then(()=> history.push('/jobs'))}
                 
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

export default observer(JobForm);
