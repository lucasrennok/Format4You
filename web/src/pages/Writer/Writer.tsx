import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './styles.css'
import PageFooter from '../../components/PageFooter/PageFooter';

function Writer() {
  return (
    <div className="page-writer">
      <PageHeader inputBoolean={true} />
      <div className="content">
        <h1>Writer</h1>
      </div>
      <PageFooter />
    </div>
  );
}

export default Writer;
