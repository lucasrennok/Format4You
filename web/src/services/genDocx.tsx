import {Packer, AlignmentType, PageBorders,Document, HeadingLevel, Paragraph, TabStopPosition, TabStopType, TextRun } from 'docx';
import {saveAs} from 'file-saver';

//this function generate a document to be downloaded
export function genDocxWordWithData(fileName: string, textWrote: string){
    const newDocument = new Document();

    newDocument.addSection({children: buildDataToTheDocument(textWrote),});

    downloadDocx(newDocument,fileName);
}

//Here the user download the document
function downloadDocx(newDoc: Document, fileName: string){
    if(fileName===""){
        fileName="newDoc";
    }

    Packer.toBlob(newDoc).then(blob => {
      saveAs(blob, fileName+".docx");
      console.log("Document created successfully");
    });
}

//This function build the data to the document
function buildDataToTheDocument(textWrote: string){
    let data = [];
    data[0] = new Paragraph({children: [new TextRun("geeeeeee"+textWrote)]})
    return data;
}