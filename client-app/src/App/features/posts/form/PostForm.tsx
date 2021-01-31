import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { PostFormValues } from "../../../models/post";
import { v4 as uuid } from "uuid";
// import LoadingComponent from "../../../../LoadingComponent";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../common/form/TextInput";
import TextAreaInput from "../../../common/form/TextAreaInput";
import SelectInput from "../../../common/form/SelectInput";
import DateInput from "../../../common/form/DateInput";

import { categoryPrograms } from "../../../common/options/categoryOptions";
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
  // city: isRequired('City'),
  // venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
})


interface DetailParams {
  id: string;
}

const PostForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createProgram,
    editpost,
    submittingPost,
    loadpost,
    deletepost
  } = rootStore.postStore;

  const [post, setpost] = useState(new PostFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadpost(match.params.id)
        .then(post => {
          setpost(new PostFormValues(post));
        })
        .finally(() => setLoading(false));
    }
  }, [loadpost, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    // const dateAndTime = combineDateAndTime( new Date(Date.now()),new Date(Date.now()));
    const { date, time, ...post } = values;
    post.date = dateAndTime;
    // const {...post} =values;
    // post.date = new Date(Date.now());

    if (!post.id) {
      let newpost = {
        ...post,
        id: uuid(),
      };
      createProgram(newpost);
    } else {
      editpost(post);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={post}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={post.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={post.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="main"
                  placeholder="Main"
                  value={post.main}
                  rows={3}
                  component={TextAreaInput}
                />
                   <Field
                  name="main2"
                  placeholder="Main2"
                  value={post.main2}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={categoryPrograms}
                  value={post.category}
                  component={SelectInput}
                />
                    <Field
                    name="image"
                    placeholder="Image"
                    value={post.image}
                    component={TextInput}
                  />
                     <Field
                    name="link"
                    placeholder="Link"
                    value={post.link}
                    component={TextInput}
                  />
                <Form.Group width="equal">
                  <Field
                    name="date"
                    placeholder="Date"
                    value={post.time}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="time"
                    placeholder="Time"
                    value={post.time}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group>
                {/* <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={post.city}
                /> */}
                {/* <Field
                  name="venue"
                  placeholder="Venue"
                  value={post.venue}
                  component={TextInput}
                /> */}
                <Button
                  loading={submittingPost}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={post.id ? () => history.push(`/programs/${post.id}`) : () => history.push("/programs")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
                    {post.id && 
                <Button
                 onClick={(e)=>deletepost(e,post.id!).then(()=> history.push('/posts'))}
                 
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

export default observer(PostForm);
