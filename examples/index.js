import React from 'react';
import ReactDOM from 'react-dom';
import { DBProvider } from '../index.js';
import createDB from './createDB';
import { QueryOutput, PullQueryOutput } from './components';

const conn = createDB();

class RootComponent extends React.Component {
  render() {
    return (
      <DBProvider conn={conn}>
        <div>
          <QueryOutput />
          <PullQueryOutput entityIds={[['name', 'Jane']]} />
        </div>
      </DBProvider>
    )
  }
}

ReactDOM.render(<RootComponent />, document.getElementById('root'));
