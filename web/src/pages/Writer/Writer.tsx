import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './styles.css'

function Writer() {
  return (
    <div className="page-writer">
      <PageHeader inputBoolean={true} ></PageHeader>
      <div className="content">
        <h1>Writer</h1>
      </div>
      {/* footer here */}
    </div>
  );
}

export default Writer;
