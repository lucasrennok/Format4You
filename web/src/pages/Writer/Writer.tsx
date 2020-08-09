import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './styles.css'
import PageFooter from '../../components/PageFooter/PageFooter';

function Writer() {
  const defaultTextArea = "";
  const [fileName, setFileName] = useState('newDocument');
  const [textInWriter, setTextInWriter] = useState('');

  const handleWriterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
    setTextInWriter(e.target.value);
  }
  
  const handleDocTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFileName(e.target.value);
  }

  function getData(){
    console.log(fileName, textInWriter);
  }

  return (
    <div className="page-writer">
      <PageHeader inputBoolean={true} />
      <div className="inputTitle">
        <label>Document title</label>
        <div className="inputBox">
          <input type="text" maxLength={15} defaultValue="newDocument" onChange={handleDocTitleChange} />
          <p>.docx</p>
        </div>
      </div>

      <div className="content">
        <h1 className="title-writer">Writer</h1>
        <textarea defaultValue={defaultTextArea} onChange={handleWriterChange}/>
        <button onClick={getData} type="button">Format</button>
      </div>
      <PageFooter />
    </div>
  );
}

export default Writer;
