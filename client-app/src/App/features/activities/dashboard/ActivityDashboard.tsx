// start typing rafc
import React from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../Models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;



};

const ActivityDashboard: React.FC<IProps> = ({
    activities, 
    selectActivity, 
    selectedActivity,
    editMode,
    setEditMode,
    setSelectedActivity



}) => {
    return (
        <div>
            <Grid>
                <Grid.Column width={10}>
                    <ActivityList
                        activities={activities}
                        selectActivity={selectActivity}
                        // delete
                    />
                </Grid.Column>
                <Grid.Column width={6}>
         {selectedActivity && !editMode && ( 
         <ActivityDetails 
                activity={selectedActivity}
                setEditMode={setEditMode}
                setSelectedActivity={setSelectedActivity}
                    />
    )} 
                {editMode && 
                    <ActivityForm 
                    // key={(selectedActivity && selectedActivity.id) || 0}
                    setEditMode={setEditMode}
                    activity={selectedActivity!}
                    // create
                    // delete
                    />
                }
                </Grid.Column>
            </Grid>
        </div>
    )
}
export default ActivityDashboard