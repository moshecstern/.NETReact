import React from "react";
import { Image, List, Popup } from "semantic-ui-react";
import { ILikedBlog } from "../../../models/blog";

interface IProps {
  peopleWhoLiked: ILikedBlog[];
}

const BlogListItemAttendees: React.FC<IProps> = ({ peopleWhoLiked }) => {
  return (
    <List horizontal>
      {peopleWhoLiked.map((attendee) => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.username}
            trigger={
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default BlogListItemAttendees;
