import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
// import businessestore from "../../../../App/stores/businessestore";
import { RootStoreContext } from "../../../stores/rootStore";
import BusinessListItem from "./BusinessListItem";
import {format} from 'date-fns';

const BusinessList: React.FC = () => {
  // const businessestore = useContext(businessestore);
  // const { businessesByDate } = businessestore;
  const rootStore = useContext(RootStoreContext);
  const {BusinessesByDate} = rootStore.businessStore;

  return (
    <Fragment>
      {BusinessesByDate.map(([group, businesses]) => (
        <Fragment key={group}>
          <Label  size="large" color="black">
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {businesses.map((Business) => (
                <BusinessListItem key={Business.id} Business={Business} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(BusinessList);
