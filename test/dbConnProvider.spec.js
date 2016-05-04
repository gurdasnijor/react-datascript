import React from 'react';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import DBConnProvider from '../src/dbConnProvider';
import withDatascriptQuery from '../src/withDatascriptQuery';


describe('DBConnProvider', () => {
  it('provides children with conn object', () => {
    const conn = {};
    class ChildComponent extends React.Component {
      static contextTypes = {
        conn: React.PropTypes.object
      };

      render() {
        return <div {...this.props} />
      }
    }

    const tree = TestUtils.renderIntoDocument(
       <DBConnProvider conn={conn}>
         <ChildComponent />
       </DBConnProvider>
     );

    const child = TestUtils.findRenderedComponentWithType(tree, ChildComponent);
    expect(child.context.conn).toEqual(conn);
  });
});
