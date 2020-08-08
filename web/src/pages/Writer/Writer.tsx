import React from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './styles.css'
import PageFooter from '../../components/PageFooter/PageFooter';

function Writer() {
  const defaultTextArea = "";

  return (
    <div className="page-writer">
      <PageHeader inputBoolean={true} />
      <div className="content">
        <h1 className="title-writer">Writer</h1>
        <textarea>{defaultTextArea}</textarea>
        <button type="button">Format</button>
      </div>
      <PageFooter />
    </div>
  );
}

export default Writer;
