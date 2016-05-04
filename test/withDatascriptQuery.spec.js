import React from 'react';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { mount } from 'enzyme';
import withDatascriptQuery from '../src/withDatascriptQuery';
import datascript from 'datascript';


class DBConnProviderMock extends React.Component {
  static childContextTypes = {
    conn: React.PropTypes.object
  };

  getChildContext() {
    return { conn: this.props.conn };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

describe('withDatascriptQuery', () => {
  it('can instantiate a component created with withDatascriptQuery and have it receive a conn', () => {
    const conn = datascript.create_conn();
    const queryHoc = withDatascriptQuery({
      query: `
        [:find ?e
         :where [?e "someattr"]]`
    });

    const QueryComponent = queryHoc(() =>
      <div>
        This is a component
      </div>
    );

    const tree = TestUtils.renderIntoDocument(
       <DBConnProviderMock conn={conn}>
         <QueryComponent />
       </DBConnProviderMock>
     );

    const child = TestUtils.findRenderedComponentWithType(tree, QueryComponent);
    expect(child.context.conn).toEqual(conn);
  });
});
