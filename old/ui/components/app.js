import React from 'react';
import AvailableNetworks from './wifi/available-networks';
import WifiModal from './wifi/wifi-modal';

const Header = () => (
  <div className="section bg-primary text-light text-center">
    <h2>Kit Robotois</h2>
    <p>Configuracion de Conexión Wifi</p>
  </div>
);

const defaultWifi = {
  ssid: '',
  pwd: '',
};

/**
 * [state description]
 * @type {Object}
 */
class App extends React.Component {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    super();
    this.state = {
      wifi: undefined,
      modal: false,
    };
    this.modalClose = this.modalClose.bind(this);
    this.selectNetwork = this.selectNetwork.bind(this);
    this.openModal = this.openModal.bind(this);
    this.changePwd = this.changePwd.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
  }
  /**
   * [componentWillMount description]
   * @return {[type]} [description]
   */
  componentWillMount() {
    this.setState({
      wifi: defaultWifi,
    });
  }
  /**
   * [modalClose description]
   * @return {[type]} [description]
   */
  modalClose() {
    this.setState({
      wifi: defaultWifi,
      modal: false,
    });
  }
  /**
   * [selectNetwork description]
   * @param  {[type]} ssid [description]
   * @return {[type]}      [description]
   */
  selectNetwork(ssid) {
    return () => this.openModal(ssid);
  }
  /**
   * [openModal description]
   * @param  {[type]} ssid [description]
   * @return {[type]}      [description]
   */
  openModal(ssid) {
    this.setState({
      wifi: { ssid, pwd: '' },
      modal: true,
    });
  }
  /**
   * [changePwd description]
   * @param  {[type]} ev [description]
   * @return {[type]}    [description]
   */
  changePwd(ev) {
    const pwd = ev.target.value;
    const { wifi } = this.state;
    console.log('pwd:', pwd);

    this.setState({
      wifi: {
        ...wifi,
        pwd,
      },
    });
  }
  /**
   * [handleConnect description]
   * @return {[type]} [description]
   */
  handleConnect() {
    console.log('wifi:', this.state.wifi);
    this.modalClose();
  }
  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    const { networks, loading } = this.props;
    const { ssid, pwd } = this.state;
    return (
      <div>
        <Header />
        <AvailableNetworks
          networks={networks}
          loading={loading}
          selectNetwork={this.selectNetwork}
        />
        <WifiModal
          {...this.state}
          changePwd={this.changePwd}
          handleConnect={this.handleConnect}
          modalClose={this.modalClose}
        />
      </div>
    );
  }
}

export default App;
