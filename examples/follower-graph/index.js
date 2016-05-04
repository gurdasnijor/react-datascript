import React from 'react';
import ReactDOM from 'react-dom';
import { DBConnProvider } from 'react-datascript';
import createDBConn from './createDBConn';
import { AllUserEdges, AllUsers, AllUsersFromIndex, FollowerTree } from './components';


const Root = () => (
  <DBConnProvider conn={createDBConn()}>
    <div>
      <AllUsers />
      <AllUsersFromIndex />
      <AllUserEdges />
      <FollowerTree entityIds={[['name', 'Jane']]} />
    </div>
  </DBConnProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
