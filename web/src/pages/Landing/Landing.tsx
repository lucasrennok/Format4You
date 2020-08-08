import React from 'react';
import backgroundImg from '../../assets/images/background.png'

import './styles.css'
import PageHeader from '../../components/PageHeader/PageHeader';

function Landing() {
  return (
    <div className="page-landing">
      <PageHeader inputBoolean={false} ></PageHeader>
      <div className="content">
        <img src={backgroundImg} alt="Leaf and Books" className="backgroundImg"/>
        <button type="button">New file</button>
      </div>
      <a href="https://github.com/lucasrennok" target="_blank" >
        <h2 className="title-footer">lucasrennok</h2>
      </a>
    </div>
  );
}

export default Landing;
