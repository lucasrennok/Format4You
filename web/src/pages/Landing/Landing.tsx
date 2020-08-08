import React from 'react';
import backgroundImg from '../../assets/images/background.png'
import {Link} from 'react-router-dom';
import './styles.css'
import PageHeader from '../../components/PageHeader/PageHeader';
import penImg from '../../assets/images/pen.png'
import PageFooter from '../../components/PageFooter/PageFooter';

function Landing() {
  return (
    <div className="page-landing">
      <PageHeader inputBoolean={false} />
      <div className="content">
        <img src={backgroundImg} alt="Leaf and Books" className="backgroundImg"/>
        <Link to="/writer" className="writeBut">
          <img src={penImg} alt="new-file"></img>
          New file
        </Link>
      </div>
      <PageFooter />
    </div>
  );
}

export default Landing;
