import React from 'react';
import axios from 'axios';
import App from '../components/app';

/**
 * [state description]
 * @type {Object}
 */
class AppContainer extends React.Component {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    super();
    this.state = {
      networks: [],
      loading: true,
    };
    this.doneLoading = this.doneLoading.bind(this);
  }
  /**
   * [componentDidMount description]
   * @return {[type]} [description]
   */
  componentDidMount() {
    // Make a request for a user with a given ID
    axios.get('/wifi/all')
      .then((response) => {
        const { data: { networks } } = response;
        this.setState({ networks }, this.doneLoading);
        // console.log(networks);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /**
  * [doneLoading description]
  * @return {[type]} [description]
  */
  doneLoading() {
    this.setState({ loading: false });
  }
  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    // console.log('networks:', this.state.networks);
    return (
      <App {...this.state} />
    );
  }
}

export default AppContainer;
