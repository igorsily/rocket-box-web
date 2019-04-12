import React, { Component } from 'react';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import { Container, ButtonSubmit } from './styles';

export default class Main extends Component {
  state = {
    newBox: '',
  };

  handleSubmit = async event => {
    event.preventDefault();
    const response = await api.post('boxes', {
      title: this.state.newBox,
    });
    this.props.history.push(`/box/${response.data._id}`);
  };

  handleOnChange = event => {
    this.setState({ newBox: event.target.value });
  };

  render() {
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="logo" />
          <input
            placeholder="Criar um box"
            value={this.state.newBox}
            onChange={this.handleOnChange}
          />
          <ButtonSubmit type="submit">Criar</ButtonSubmit>
        </form>
      </Container>
    );
  }
}
