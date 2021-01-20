import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import BusinessDetailedHeader from "./BusinessDetailedHeader";
import BusinessDetailedInfo from "./BusinessDetailedInfo";
import BusinessDetailedChat from "./BusinessDetailedChat";
import BusinessDetailedSidebar from "./BusinessDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const BusinessDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadbusiness, loadingInitialBusiness, business} = rootStore.businessStore;
  const [ initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    loadbusiness(match.params.id).then(()=>setInitialLoad(false));
  }, [loadbusiness, match.params.id, history]);

  if (loadingInitialBusiness || !business || initialLoad)
    return <LoadingComponent content="Loading Business..." />;

  if (!business)
  return <h2>Business not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <BusinessDetailedHeader Business={business} />
      <BusinessDetailedInfo Business={business} />
      {!initialLoad && <BusinessDetailedChat />}
   </Grid.Column>
   <Grid.Column width={6}>
      <BusinessDetailedSidebar
        attendees={business.liked}
      />
   </Grid.Column>
 </Grid>
  );
};

export default observer(BusinessDetails);
