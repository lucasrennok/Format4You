import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './styles.css'
import PageFooter from '../../components/PageFooter/PageFooter';
import { genDocxWordWithData } from '../../services/genDocx';

function Writer() {
  // defaultTextArea => template SBC
  const defaultTextArea = "#title: Title here\n#author: Name here\n#institute: Institute here\n#email: E-mail here\n#abstract: #b: Abstract. #bc: \n#resumo: #b: Resumo. #bc: \n#section: 1. First Section\n#: \n#text: Text from the first phrase of the section\n#t: Text in other paragraphs\n#img: \'URL_image_here\'\n#caption: Figure 1. This is a caption\n#section: 2. References\n#ref: Rennó, L.(2000), \"GitHub: lucasrennok\", http://github.com/lucasrennok, August.\n#: This is a commentary";
  const [fileName, setFileName] = useState('newDocument');
  const [textInWriter, setTextInWriter] = useState('');

  const handleWriterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
    setTextInWriter(e.target.value);

    const numScroll = e.target.scrollHeight;
    e.target.style.height = (numScroll-(numScroll%25))+'px';
  }
  
  const handleDocTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFileName(e.target.value);
  }

  function getData(){
    genDocxWordWithData(fileName, textInWriter);
  }

  return (
    <div className="page-writer">
      <PageHeader inputBoolean={true} />
      <div className="inputTitle">
        <label>Document title</label>
        <div className="inputBox">
          <input placeholder="Type a title" type="text" maxLength={15} defaultValue="newDocument" onChange={handleDocTitleChange} />
          <p>.docx</p>
        </div>
      </div>

      <div className="content">
        <h1 className="title-writer">Writer</h1>
        <textarea placeholder="Type something" defaultValue={defaultTextArea} onChange={handleWriterChange} className="autoTextArea" />
        <button onClick={getData} type="button">Format</button>
      </div>
      <PageFooter />
    </div>
  );
}

export default Writer;
