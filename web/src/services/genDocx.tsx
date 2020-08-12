import {Packer, AlignmentType, PageBorders,Document, HeadingLevel, Paragraph, TabStopPosition, TabStopType, TextRun, SymbolRun, Indent, Media, PictureRun, TableCell, TableRow, Table } from 'docx';
import {saveAs} from 'file-saver';

//this function generate a document to be downloaded
export function genDocxWordWithData(fileName: string, textWrote: string){
    const newDocument = buildDataToTheDocument(textWrote);

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
    const newDocument = new Document();

    const commands = ['#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#n:','#t:','#section:','#subsec:','#text:','#:','#b:', '#bc:','#i:', '#ic:', '#ref:', '#img:', '#caption:','#caption-justified','#table-title:','#table-title-justified:','#table:'];
    let styleFormatList = {};
    let styleTextList = {};
    let data = [], phrase = [];
    let word = "";
    let commentary = false, theNextIsAnImage = false;
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#table:' && !commentary){
            let response = createTable(textWrote, i);
            //@ts-ignore
            data[data.length] = response.table;
            //@ts-ignore
            i = response.newIndex;
        }
        else if(theNextIsAnImage){ //If is an image
            let width = 0, height = 0, newSize='';
            theNextIsAnImage = false;
            const fileImg = fetch(word).then(r => r.blob());
            if(textWrote[i]!='\n'){ // Resizable
                i++;
                while(textWrote[i]!==' ' && textWrote[i]!=='\n'){
                    newSize+=textWrote[i];
                    i++;
                }
                width=Number(newSize);
                newSize='';
                while(textWrote[i]!=='\n'){
                    newSize+=textWrote[i];
                    i++;
                }
                if(newSize===''){
                    height=width;
                    newSize='flag';
                }else{
                    height=Number(newSize);
                }
            }
            let newImage;
            if(newSize!==''){
                //@ts-ignore
                newImage = Media.addImage(newDocument, fileImg,width, height); 
            }else{
                //@ts-ignore
                newImage = Media.addImage(newDocument, fileImg);
            }
            data[data.length] = new Paragraph({children: [newImage], ...styleFormatList});
        }else if(commands.includes(word)){
            if(word==='#:'){ // commentary
                if(textWrote[i]!=='\n'){
                    commentary = true;
                }
            }else if(word==='#n:'){ // \n
                if(!commentary){
                    data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
                }
                phrase = []
            }else if(word==='#t:' && !commentary){ // \t
                phrase[phrase.length] = new TextRun({text: '\t',...styleTextList})
            }else if(word==='#b:' || word==='#bc:' || word==='#i:' || word==='#ic:'){ // bold and italic
                if(!commentary){
                    if(word==='#b:'){
                        styleTextList = { ...styleTextList, bold: true}
                    }else if(word==='#bc:'){
                        styleTextList = { ...styleTextList, bold: false}
                    }else if(word==='#i:'){
                        styleTextList = { ...styleTextList, italics: true}
                    }else if(word==='#ic:'){
                        styleTextList = { ...styleTextList, italics: false}
                    }
                }
            }else if(!commentary){
                //get the paragraph style
                styleFormatList = getStyleFormatFrom(word);
                //get the text style
                styleTextList = getStyleTextFrom(word);
                if(word==='#img:'){
                    theNextIsAnImage = true;
                }
            }
        }else if(textWrote[i]==='\n'){
            if(!commentary){
                phrase[phrase.length] = new TextRun({text: word,...styleTextList});
                data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
            }
            phrase = []
            commentary = false;
        }else{
            if(i<textWrote.length){
                phrase[phrase.length] = new TextRun({text: word+textWrote[i],...styleTextList})
            }else{
                phrase[phrase.length] = new TextRun({text: word,...styleTextList})
            }
        }
        word="";
    }
    // Get the last line
    if(!commentary){
        data[data.length] = new Paragraph({children: phrase, ...styleFormatList});
    }

    newDocument.addSection({margins: { //margin of the document
        top: 1985,  // 3,5cm = 1985
        right: 1700,  // 3cm = 1700
        bottom: 1420,  // 2,5cm = 1420
        left: 1700,  //3cm = 1700
    },children: data,});

    return newDocument;
}

//Create the table
function createTable(textWrote: string, index: number){
    let response = {};
    let newIndex = index;
    let word = '', phrase = '';
    let rows = [];
    let cels = [];
    
    //get the paragraph style
    let styleFormatList = getStyleFormatFrom('#table:');
    //get the text style
    let styleTextList = getStyleTextFrom('#table:');
    
    for(let i=index; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#tablec:'){
            newIndex = i;
            break;
        }else if(word==='#celc:'){
            cels[cels.length] = new TableCell({
                                children: [new Paragraph({children:[new TextRun({text: phrase, ...styleTextList})],})],
                            });
            phrase = '';
        }else if(word==='#rowc:'){
            rows[rows.length] = new TableRow({children: cels});
            cels = [];
        }else{
            phrase+=word;
            if(textWrote[i]!=='\n'){
                phrase+=textWrote[i];
            }
        }
        word='';
    }
    const table = new Table({
        rows: rows,
        ...styleFormatList,
    });
    response = {newIndex: newIndex, table: table}
    return response;
}

//Get the style to the paragraph
function getStyleFormatFrom(word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#author:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#institute:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#email:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#abstract:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#resumo:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#section:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#subsec:':
            styleCreate = {
                spacing: {
                    before: 240, // 240 = 12pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.LEFT,
            }
            break;
        case '#text:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#ref:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    hanging: 285, // 285 = 0,5cm
                    left: 285, // 285 = 0,5cm
                    right: 0,
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#caption:': // for one line caption
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt 
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8 cm
                    right: 455, // 455 = 0,8 cm
                },
                alignment: AlignmentType.CENTER, //if there is more than 1 line, is justified
            }
            break;
        case '#caption-justified:':   //for two or more line captions
            styleCreate = { 
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt 
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8 cm
                    right: 455, // 455 = 0,8 cm
                },
                alignment: AlignmentType.JUSTIFIED, //if there is more than 1 line, is justified
            }
            break;
        case '#img:':
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0,
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#table-title:': //for one line titles
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        case '#table-title-justified:': //for two or more line titles
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 120, // 120 = 6pt
                },
                indent: {
                    firstLine: 0,
                    left: 455, // 455 = 0,8cm
                    right: 455, // 455 = 0,8cm
                },
                alignment: AlignmentType.JUSTIFIED,
            }
            break;
        case '#table:': 
            styleCreate = {
                spacing: {
                    before: 120, // 120 = 6pt
                    after: 0, 
                },
                indent: {
                    firstLine: 0,
                    left: 0, 
                    right: 0, 
                },
                alignment: AlignmentType.CENTER,
            }
            break;
        default:
            break;
    }
    return styleCreate;
}

//Get the style to the text
function getStyleTextFrom(word: string){
    let styleCreate = {}
    switch(word){
        case '#title:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 32, // 32 = 16 size
                italics: false,
            }
            break;
        case '#author:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24, // 24 = 12 size
                italics: false,
            }
            break;
        case '#institute:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#email:':
            styleCreate = {
                bold: false,
                font: "Courier New",
                size: 20, // 20 = 10 size
                italics: false,
            }
            break;
        case '#abstract:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: true,
            }
            break;
        case '#resumo:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: true,
            }
            break;
        case '#section:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 26, //26 = 13 size
                italics: false,
            }
            break;
        case '#subsec:':
            styleCreate = {
                bold: true,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#text:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#ref:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#caption:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#caption-justified:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#img:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        case '#table-title:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#table-title-justified:':
            styleCreate = {
                bold: true,
                font: "Helvetica",
                size: 20, //20 = 10 size
                italics: false,
            }
            break;
        case '#table:':
            styleCreate = {
                bold: false,
                font: "Times",
                size: 24, //24 = 12 size
                italics: false,
            }
            break;
        default:
            break;
    }
    return styleCreate;
}
