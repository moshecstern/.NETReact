import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import {BlogFormValues} from "../../../models/blog";
import { v4 as uuid } from "uuid";
// import LoadingComponent from "../../../../LoadingComponent";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../common/form/TextInput";
import TextAreaInput from "../../../common/form/TextAreaInput";
import SelectInput from "../../../common/form/SelectInput";
// import DateInput from "../../../common/form/DateInput";

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
  // city: isRequired('City'),
  // venue: isRequired('Venue'),
  // date: isRequired('Date'),
  // time: isRequired('Time'),
})


interface DetailParams {
  id: string;
}

const BlogForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createblog,
    editblog,
    submittingBlog,
    loadblog,
    deleteblog
  } = rootStore.blogStore;

  const [blog, setBlog] = useState(new BlogFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadblog(match.params.id)
        .then(blog => {
          setBlog(new BlogFormValues(blog));
        })
        .finally(() => setLoading(false));
    }
  }, [loadblog, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    // const dateAndTime = combineDateAndTime(values.date, values.time);
    const dateAndTime = combineDateAndTime( new Date(Date.now()),new Date(Date.now()));

    const { date, time, ...blog } = values;
    blog.date = dateAndTime;
    // const {...blog} = values;
    // blog.date = new Date(Date.now());

    if (!blog.id) {
      let newBlog = {
        ...blog,
        id: uuid(),
      };
      createblog(newBlog);
    } else {
      editblog(blog);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
            initialValues={blog}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={blog.title}
                  component={TextInput}
                />
                   <Field
                  name="main"
                  placeholder="Main"
                  value={blog.main}
                  rows={3}
                  component={TextAreaInput}
                />
                   <Field
                  name="main2"
                  placeholder="Main2"
                  value={blog.main2}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={blog.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  options={category}
                  value={blog.category}
                  component={SelectInput}
                />
                {/* <Form.Group width="equal">
                  // <Field
                  //   name="date"
                  //   placeholder="Date"
                  //   value={blog.time}
                  //   component={DateInput}
                  //   date={true}
                  // />
                  <Field
                    name="date"
                    placeholder="Time"
                    value={blog.date}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group> */}
                {/* <Field
                  name="city"
                  component={TextInput}
                  placeholder="City"
                  value={blog.city}
                /> */}
                {/* <Field
                  name="venue"
                  placeholder="Venue"
                  value={blog.venue}
                  component={TextInput}
                /> */}
                <Button
                  loading={submittingBlog}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={blog.id ? () => history.push(`/blogs/${blog.id}`) : () => history.push("/blogs")}
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
                    {blog.id && 
                <Button
                 onClick={(e)=>deleteblog(e,blog.id!).then(()=> history.push('/blogs'))}
                 
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

export default observer(BlogForm);
