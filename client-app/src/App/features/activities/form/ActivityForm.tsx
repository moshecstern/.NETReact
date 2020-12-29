import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../Models/activity";
import { v4 as uuid } from "uuid";
// import LoadingComponent from "../../../../LoadingComponent";
import ActivityStore from "../../../stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity
  } = activityStore;

  
  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });
  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () =>initialFormState && setActivity(initialFormState))
    };
    return () => {
      clearActivity()
    }
  }, [loadActivity, clearActivity, initialFormState, match.params.id, activity.id.length]);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`));;
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <div>
      <Segment clearing>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            name="title"
            onChange={handleInputChange}
            placeholder="Title"
            value={activity.title}
          />
          <Form.TextArea
            name="description"
            onChange={handleInputChange}
            rows={2}
            placeholder="Description"
            value={activity.description}
          />
          <Form.Input
            name="category"
            onChange={handleInputChange}
            placeholder="Category"
            value={activity.category}
          />
          <Form.Input
            name="date"
            onChange={handleInputChange}
            type="datetime-local"
            placeholder="Date"
            value={activity.date}
          />
          <Form.Input
            name="city"
            onChange={handleInputChange}
            placeholder="City"
            value={activity.city}
          />
          <Form.Input
            name="venue"
            onChange={handleInputChange}
            placeholder="Venue"
            value={activity.venue}
          />
          <Button
            loading={submitting}
            floated="right"
            positive
            type="submit"
            content="Submit"
          />
          <Button
            onClick={() => history.push('/activities')}
            floated="right"
            type="button"
            content="Cancel"
          />
        </Form>
      </Segment>
    </div>
  );
};

export default observer(ActivityForm);
