import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
import ActivityStore from "../../../../App/stores/activityStore";
import { RootStoreContext } from "../../../stores/rootStore";
import ActivityListItem from "./ActivityListItem";

const ActivityList: React.FC = () => {
  // const activityStore = useContext(ActivityStore);
  // const { activitiesByDate } = activityStore;
  const rootStore = useContext(RootStoreContext);
  const {activitiesByDate} = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label  size="large" color="blue">
            {group}
          </Label>
            <Item.Group divided>
              {activities.map((activity) => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
