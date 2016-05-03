import React from 'react';
import ReactDOM from 'react-dom';
import { DBProvider } from 'react-datascript';
import createDB from './createDB';
import { AllUserEdges, AllUsers, FollowerTree } from './components';

const conn = window.conn = createDB();

class RootComponent extends React.Component {
  render() {
    return (
      <DBProvider conn={conn}>
        <div>
          <AllUsers />
          <AllUserEdges />
          <FollowerTree entityIds={[['name', 'Jane']]} />
        </div>
      </DBProvider>
    )
  }
}

ReactDOM.render(<RootComponent />, document.getElementById('root'));
