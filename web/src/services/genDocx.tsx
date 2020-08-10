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
    const commands = ['#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#n:','#t:','#section:','#subsec:','#text:','#:'];
    let data = [];
    let textAux = "", word = "";
    let commentary = false;
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(commands.includes(word)){
            //word diferentes fazem um tipo de formato do paragraph
            if(word==="#:"){ // commentary
                commentary = true;
            }else if(word==='#n:'){ // \n
                if(!commentary){
                    data[data.length] = new Paragraph({children: [new TextRun(textAux)]});
                }
                textAux = "";
            }else if(word==='#t:'){ // \t
                textAux += '\t';
            }
        }else if(textWrote[i]==="\n"){
            if(!commentary){
                data[data.length] = new Paragraph({children: [new TextRun(textAux+word)]});
            }
            textAux = "";
            commentary = false;
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
    if(!commentary){
        data[data.length] = new Paragraph({children: [new TextRun(textAux)]});
    }
    return data;
}