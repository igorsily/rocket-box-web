/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';

import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import socket from 'socket.io-client';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import logo from '../../assets/logo.svg';

import './styles.css';
import api from '../../services/api';

export default class Box extends Component {
  state = { box: {} };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);

    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://rocketbox-server.herokuapp.com/');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] },
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();

      data.append('file', file);

      api.post(`boxes/${this.state.box._id}/files`, data);
    });
  };
  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="logo" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#A5CFFF" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  Há{' '}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt,
                  })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
