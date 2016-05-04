import React from 'react';

export default class DBConnProvider extends React.Component {
  static childContextTypes = {
    conn: React.PropTypes.object
  };

  static propTypes = {
    conn: React.PropTypes.object
  };

  getChildContext() {
    return { conn: this.conn };
  }

  constructor(props, context) {
    super(props, context);
    this.conn = props.conn;
  }

  render() {
    let { children } = this.props;
    return React.Children.only(children);
  }
}
