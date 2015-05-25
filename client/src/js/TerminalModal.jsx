const React = require('react');
const auth = require("./Auth.js");
const request = require('superagent');
const {Grid, Row, Col, Table, Button, Modal} = require('react-bootstrap');
const async = require("async");
const _ = require('underscore');
const moment = require('moment');

module.exports = React.createClass({
  getInitialState(){
    return {terminalConf:{}};
  },
  componentDidMount() {
    let component = this;
    request
      .post('/terminal')
      .set('authToken', auth.getToken())
      .set('Accept', 'application/json')
      .send({
        username: this.props.username,
        host: this.props.host})
      .end((err, res) => {
        console.log(res.body);
        component.setState({
          terminalConf: res.body
        });
      });
  },
  render() {
    let iframe;
    if (this.state.terminalConf.port) {
      let endpoint = `http://${window.location.hostname}:${this.state.terminalConf.port}/`;
      console.log(endpoint);
      iframe = <iframe src={`http://localhost:${this.state.terminalConf.port}/`} width='100%' height='100%'></iframe>
    }
    return (
      <Modal {...this.props} title='Modal heading' dialogClassName='modal-body' animation={false}>
        {iframe}
      </Modal>
    );
  }
});