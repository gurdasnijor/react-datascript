import React from 'react';
import ReactDOM from 'react-dom';
import { DBConnProvider } from 'react-datascript';
import createDB from './createDB';
import { AllUserEdges, AllUsers, AllUsersFromIndex, FollowerTree } from './components';

const conn = window.conn = createDB();

class RootComponent extends React.Component {
  render() {
    return (
      <DBConnProvider conn={conn}>
        <div>
          <AllUsers />
          <AllUsersFromIndex />
          <AllUserEdges />
          <FollowerTree entityIds={[['name', 'Jane']]} />
        </div>
      </DBConnProvider>
    );
  }
}

ReactDOM.render(<RootComponent />, document.getElementById('root'));
