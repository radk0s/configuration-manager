const React = require('react');
const Modal = require('react-bootstrap').Modal;
const Input = require('react-bootstrap').Input;
const request = require('superagent');
const auth = require("./Auth.js");
const moment = require('moment');
const _ = require('underscore');

module.exports =  React.createClass({
  getInitialState() {
    return {
      provider: 'DIGITAL_OCEAN',
      saveConf: false,
      DORegions: [],
      DOImages: [],
      DOSizes: []
    }
  },
  handleSelectChange() {
    this.setState({
      provider: this.refs.input.getValue()
    }, () => {
      console.log(this.state.provider);
    });
  },
  componentDidMount() {
    let self = this;
    request.get('/regions/do')
      .set('authToken', auth.getToken())
      .end((err, res) => {
        self.setState({
          DORegions: res.body.regions
        });
      });
    request.get('/images/do')
      .set('authToken', auth.getToken())
      .end((err, res) => {
        self.setState({
          DOImages: res.body.images
        });
      });
    request.get('/sizes/do')
      .set('authToken', auth.getToken())
      .end((err, res) => {
        self.setState({
          DOSizes: res.body.sizes
        });
      });
  },
  componentDidUpdate() {
    this.render();
  },
  handleSelectConfChange() {

    let confId = parseInt(this.refs.configurations.getValue());
    console.log(confId);
    console.log(this.props.confs);

    let data = _.head(_.where(this.props.confs, {id: confId})).data;
    if(this.state.provider === "AWS") {}
    let conf = JSON.parse(data);
    conf.provider = this.state.provider;
    this.setState(conf);
  },
  handleDOSubmit(event) {

    let configuration = {
      "name": this.refs.name.getValue(),
      "region": this.refs.region.getValue(),
      "size": this.refs.size.getValue(),
      "image": this.refs.image.getValue(),
      "ssh_keys": null,
      "backups": false,
      "ipv6": true,
      "user_data": null,
      "private_networking": null
    }

    request
      .put('/instances/do')
      .set('authToken', auth.getToken())
      .set('Accept', 'application/json')
      .send(configuration)
      .end((err, res) => {
        console.log(res);
      });

    if(this.refs.saveConfig.getValue() === "yes") {
      console.log("Saving configuration " + configuration.name);
      request
        .post('/configuration')
        .set('authToken', auth.getToken())
        .set('Accept', 'application/json')
        .send({ name: 'DO-' + moment().format(),
          provider: 'DIGITAL_OCEAN',
          data: JSON.stringify(configuration)
        })
        .end((err, res) => {

        });
    }
  },
  handleAWSSubmit (event) {
    var imageId = this.refs.imageId.getValue();
    var instanceType = this.refs.instanceType.getValue();
    var keyName = this.refs.keyName.getValue();
    var securityGroup = this.refs.securityGroup.getValue();

    let configuration = {
      imageId,
      instanceType,
      keyName,
      securityGroup
    };

    request
      .put('/instances/aws')
      .set('authToken', auth.getToken())
      .set('Accept', 'application/json')
      .send(configuration)
      .end((err, res) => {
      });

    if(this.refs.saveConfig.getValue() === "yes") {
      request
        .post('/configuration')
        .set('authToken', auth.getToken())
        .set('Accept', 'application/json')
        .send({ name: 'AWS-' + moment().format(),
          provider: 'AWS',
          data: JSON.stringify(configuration)
        })
        .end((err, res) => {
        });
    }

  },
  render() {
    let createForm;

      if (this.state.provider == 'AWS') {
        createForm = <form style={{width: '60%', 'margin-left': 10, 'margin-right': 'auto'}} onSubmit={this.handleAWSSubmit}>
          <Input type='text' value={this.state.imageId} onChange={() => { this.setState({imageId: this.refs.imageId.getValue()})}} label='imageId' ref={'imageId'}/>
          <Input type='text' value={this.state.instanceType} onChange={() => this.setState({instanceType: this.refs.instanceType.getValue()})} label='instanceType' ref={'instanceType'}/>
          <Input type='text' value={this.state.keyName} onChange={() => this.setState({keyName: this.refs.keyName.getValue()})} label='keyName' ref={'keyName'}/>
          <Input type='text' value={this.state.securityGroup} onChange={() => this.setState({securityGroup: this.refs.securityGroup.getValue()})} label='securityGroup' ref={'securityGroup'}/>
          <Input type='select' value={this.state.saveConfig} onChange={() => { this.setState({saveConfig: this.refs.saveConfig.getValue()})}} label='Save Configuration?' ref={'saveConfig'}>
            <option value="no" key="1">No</option>
            <option value="yes" key="2">Yes</option>
          </Input>
          <Input type='submit' value='Create AWS Instance'/>
        </form>;
      } else {
        var regions = this.state.DORegions.map(function(item, index) {
          return <option value={item.slug} key={index}>{item.name}</option>;
        });
        var images = this.state.DOImages.map(function(item, index) {
          return <option value={item.slug} key={index}>{item.slug}</option>;
        });
        var sizes = this.state.DOSizes.map(function(item, index) {
          return <option value={item.slug} key={index}>{item.slug}</option>;
        });
        createForm = <form style={{width: '60%', 'margin-left': 10, 'margin-right': 'auto'}} onSubmit={this.handleDOSubmit}>
          <Input type='text' value={this.state.name} onChange={() => { this.setState({name: this.refs.name.getValue()})}} label='name' ref={'name'}/>
          <Input type='select' value={this.state.region} onChange={() => { this.setState({region: this.refs.region.getValue()})}} label='region' ref={'region'}>
            {regions}
          </Input>
          <Input type='select' value={this.state.image} onChange={() => { this.setState({image: this.refs.image.getValue()})}} label='image' ref={'image'}>
            {images}
          </Input>
          <Input type='select' value={this.state.size} onChange={() => { this.setState({size: this.refs.size.getValue()})}} label='size' ref={'size'}>
            {sizes}
          </Input>
          <Input type='select' value={this.state.saveConfig} onChange={() => { this.setState({saveConfig: this.refs.saveConfig.getValue()})}} label='Save Configuration?' ref={'saveConfig'}>
            <option value="no" key="1">No</option>
            <option value="yes" key="2">Yes</option>
          </Input>
          <Input type='submit' value='Create DO Instance'/>
        </form>
      }
    let options = this.props.confs.map((item, index) => {
      return  <option value={item.id} key={index}>{item.name}</option>
    });

    return (
      <Modal {...this.props} bsStyle="primary" title={ this.props.title }>
        <div style={{width: '140px', 'margin-left': 10}}>
          <h4>Select recent configuration:</h4>

          <Input type='select' ref='configurations' onChange={this.handleSelectConfChange}>
            {options}
          </Input>

          <h4>Select Provider:</h4>
          <Input type='select' ref='input' value={this.state.provider} onChange={this.handleSelectChange}>
            <option value={'DIGITAL_OCEAN'} key={0}>DO</option>
            <option value={'AWS'} key={1}>AWS</option>
          </Input>
        </div>
        {createForm}
      </Modal>
    );
  }
});