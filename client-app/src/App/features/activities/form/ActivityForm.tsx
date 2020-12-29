import React, { FormEvent, useContext, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../Models/activity";
import {v4 as uuid} from 'uuid';
// import LoadingComponent from "../../../../LoadingComponent";
import ActivityStore from '../../../stores/activityStore';
import { observer } from "mobx-react-lite";

interface IProps {
  activity: IActivity;

  // delete
}

const ActivityForm: React.FC<IProps> = ({ activity: initialFormState,}) => {

  const activityStore = useContext(ActivityStore);
  const {createActivity, editActivity, submitting, cancelFormOpen} = activityStore;

  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
        let newActivity = {
            ...activity,
            id: uuid()
        }
        createActivity(newActivity)
    }else {
        editActivity(activity)
    }
  }

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
          <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
          <Button
            onClick={cancelFormOpen}
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
