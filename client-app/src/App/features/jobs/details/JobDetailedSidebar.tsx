import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Segment, List, Item, Label, Image } from "semantic-ui-react";
import { IApplied } from "../../../models/jobs";

interface IProps {
  applicants: IApplied[];
}

const JobDetailedSidebar: React.FC<IProps> = ({ applicants }) => {
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="grey"
      >
        {applicants.length} {applicants.length === 1 ? "Person" : "People"} Applying
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {applicants.map((applicant) => (
            <Item key={applicant.username} style={{ position: "relative" }}>
              {applicant.isHost && (
                <Label
                  style={{ position: "absolute" }}
                  color="orange"
                  ribbon="right"
                >
                  Host
                </Label>
              )}
              <Image size="tiny" src={applicant.image || "/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${applicant.username}`}>{applicant.displayName}</Link>
                </Item.Header>
                <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>
              </Item.Content>
            </Item>
          ))}

        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(JobDetailedSidebar);
