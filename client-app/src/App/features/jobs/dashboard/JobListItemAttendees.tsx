import React from "react";
import { Image, List, Popup } from "semantic-ui-react";
import { IApplied } from "../../../models/jobs";

interface IProps {
  applicants: IApplied[];
}

const JobListItemAttendees: React.FC<IProps> = ({ applicants }) => {
  return (
    <List horizontal>
      {applicants.map((applicant) => (
        <List.Item key={applicant.username}>
          <Popup
            header={applicant.username}
            trigger={
              <Image
                size="mini"
                circular
                src={applicant.image || "/assets/user.png"}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default JobListItemAttendees;
