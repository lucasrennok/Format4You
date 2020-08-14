import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';


import './styles.css'
import PageFooter from '../../components/PageFooter/PageFooter';
import {genDocxWordWithData} from '../../services/genDocx';

function Writer() {
  // defaultTextArea => template SBC
  const defaultTextArea = "#order: true\n#title: Title here\n#author: Name here\n#institute: Institute here\n#email: E-mail here\n#abstract: #b: Abstract. #bc: the abstract here\n#resumo: #b: Resumo. #bc: o resumo aqui\n#: \n#section: First Section\n#: \n#text: Text from the first phrase of the section\n#t: Text in other paragraphs\n#subsec: Subsection\n#text: Something here.\n#img: 'URL_image_here'\n#caption: This is a caption\n#section: Second section\n#table:\nName #celc: Age #celc: #rowc:\nLucas #celc: 20 #celc: #rowc:\n#tablec:\n#section: References\n#ref: Rennó, L.(2000), \"GitHub: lucasrennok\", http://github.com/lucasrennok, August.\n#: This is a commentary";
  const [fileName, setFileName] = useState('newDocument');
  const [textInWriter, setTextInWriter] = useState(defaultTextArea);

  const handleWriterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
    setTextInWriter(e.target.value);

    const numScroll = e.target.scrollHeight;
    e.target.style.height = (numScroll-(numScroll%25))+'px';
  }
  
  const handleDocTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFileName(e.target.value);
  }

  const getData = () => {
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
