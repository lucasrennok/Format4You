import {Packer, AlignmentType, PageBorders,Document, HeadingLevel, Paragraph, TabStopPosition, TabStopType, TextRun, SymbolRun } from 'docx';
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
    let textAux = "", word = "";
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#title:'){
            console.log('tudo bom');
        }else if(textWrote[i]==="\n"){
            data[data.length] = new Paragraph({children: [new TextRun(textAux+word)]});
            textAux = "";
        }else{
            if(i<textWrote.length){
                textAux+=word+textWrote[i];
            }else{
                textAux+=word;
            }
        }
        word="";
    }
    // Get the last line
    data[data.length] = new Paragraph({children: [new TextRun(textAux)]});
    return data;
}