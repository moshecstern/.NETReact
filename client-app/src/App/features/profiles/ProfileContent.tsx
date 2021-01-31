import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';
import ProfileBlogs from './ProfileBlogs';
import ProfileExperience from './ProfileExperience';
import ProfileAppliedJobs from './ProfileAppliedJobs';
// import ProfilePostedJobs from './ProfilePostedJobs';
import ProfileMessages from './ProfileMessages';
import ProfileBusinesses from './ProfileBusinesses'


const panes = [
  { menuItem: 'About', render: () => <ProfileDescription /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  { menuItem: 'Experiences', render: () => <ProfileExperience /> },
  { menuItem: 'Followers', render: () => <ProfileFollowings /> },
  { menuItem: 'Following', render: () => <ProfileFollowings /> },
  { menuItem: 'Activities', render: () => <ProfileActivities />},
  { menuItem: 'Blogs', render: () => <ProfileBlogs /> },
  // { menuItem: 'MyStore', render: () => <ProfileStore /> }
  { menuItem: 'Jobs ', render: () => <ProfileAppliedJobs /> },
  // { menuItem: 'Posted Jobs ', render: () => <ProfilePostedJobs /> },
  { menuItem: 'Messages ', render: () => <ProfileMessages /> },
  { menuItem: 'Businesses ', render: () => <ProfileBusinesses /> }
  // { menuItem: 'Posts ', render: () => <ProfilePosts /> }
  // { menuItem: 'Products ', render: () => <ProfileProducts /> }
  // { menuItem: 'Cart ', render: () => <ProfileCarts /> }



];

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  );
};

export default ProfileContent;
