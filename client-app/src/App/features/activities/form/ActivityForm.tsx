import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../Models/activity'


interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    // create
    // delete
}

const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initialFormState
}) => {

    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    };

    // const [activity, setActivity] = useState<IActivity>(initializeForm);

    return (
        <div>
            <Segment>
                <Form>
                    <Form.Input placeholder='Title' />
                    <Form.TextArea rows={2} placeholder='Description' />
                    <Form.Input placeholder='Category' />
                    <Form.Input type='date' placeholder='Date' />
                    <Form.Input placeholder='City' />
                    <Form.Input placeholder='Venue' />
                </Form>
            </Segment>
        </div>
    )
}

export default ActivityForm
