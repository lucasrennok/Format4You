import {Packer, Document, Paragraph, TextRun, Media, TableCell, TableRow, Table } from 'docx';
import {saveAs} from 'file-saver';

//this next import will be used in the future
//import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import api from './api';

//this function generate a document to be downloaded
export const genDocxWordWithData = async (fileName: string, textWrote: string) => {
    const newDocument = await buildDataToTheDocument(textWrote);

    downloadDocx(newDocument,fileName);
}

//Here the user download the document
const downloadDocx = (newDoc: Document, fileName: string) => {
    if(fileName===""){
        fileName="newDoc";
    }

    Packer.toBlob(newDoc).then(blob => {
      saveAs(blob, fileName+".docx");
      console.log("Document created successfully");
    });
}

//This function build the data to the document
const buildDataToTheDocument = async (textWrote: string) => {
    const newDocument = new Document();
    
    const fixedCommands = ['#:','#b:','#bc:','#i:','#ic:','#n:','#t:']; //are all fixed commands
    let commands = ['#title:','#author:','#institute:','#email:','#abstract:','#resumo:','#section:',
    '#subsec:','#text:', '#ref:', '#img:', '#caption:','#caption-justified','#table-title:',
    '#table-title-justified:','#table:'];   // default commands(can be changed by a new template)
    let styleFormatList = {};
    let styleTextList = {};
    let data = [], phrase = [];
    let word = "", sectionNum=1, subsecNum=1, pictureNum=1, tableNum=1, templateName='sbc'; //default template
    let commentary = false, theNextIsAnImage = false, orderThings = false;
    
    //Default Settings
    let captionDefault='#caption:', bigCaptionDefault='#caption-justified:';
    let tableTitleDefault='#table-title:', bigTableTitleDefault='#table-title-justified:';
    let sectionDefault='#section:', subsecDefault='#subsec:';
    let imgDefault = '#img:';    
    let tableDefault = '#table:';
    
    for(let i=0; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#template:' && !commentary){ // #template: is a fixed command
            i++;
            if(templateName!==''){
                templateName='';
            }
            while(textWrote[i]!=='\n' && i<textWrote.length){
                templateName+=textWrote[i];
                i++;
            }
            let urlTemplateName = encodeURI(templateName);
            await api.get('template/commands?template='+urlTemplateName).then(response => {
                commands = response.data.allcommands;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=table').then(response => {
                tableDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=image').then(response => {
                imgDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=caption').then(response => {
                captionDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=bigcaption').then(response => {
                bigCaptionDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=tabletitle').then(response => {
                tableTitleDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=bigtabletitle').then(response => {
                bigTableTitleDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=section').then(response => {
                sectionDefault = response.data.command;
            });
            await api.get('template/command/type?template='+urlTemplateName+'&commandtype=subsection').then(response => {
                subsecDefault = response.data.command;
            });
        }else if(word==='#order:' && !commentary){ // #order: is a fixed command
            i++;
            let orderString = ''
            while(textWrote[i]!=='\n' && i<textWrote.length){
                orderString+=textWrote[i];
                i++;
            }
            if(orderString==='TRUE' || orderString==='True' || orderString==='true' || orderString==='T' || orderString==='t'){
                orderThings=true;
            }else{
                orderThings=false;
            }
        }else if(word===tableDefault && !commentary){
            let response = await createTable(textWrote, i, templateName, tableDefault);
            //@ts-ignore
            data[data.length] = response.table;
            //@ts-ignore
            i = response.newIndex;
        }else if(theNextIsAnImage){ //If is an image
            let width = 0, height = 0, newSize='';
            theNextIsAnImage = false;
            const fileImg = await fetch(word).then(r => r.blob());
            if(textWrote[i]!=='\n'){ // Resizable
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
                    newSize='flag'; //something to continue
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
        }else if(fixedCommands.includes(word) || commands.includes(word)){
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
                styleFormatList = await getStyleFormatFrom(templateName, word);
                //get the text style
                styleTextList = await getStyleTextFrom(templateName, word);
                if(orderThings){
                    if(word===captionDefault || word===bigCaptionDefault){
                        phrase[phrase.length] = new TextRun({text: 'Picture '+pictureNum+'. ', ...styleTextList})
                        pictureNum++;
                    }else if(word===tableTitleDefault || word===bigTableTitleDefault){
                        phrase[phrase.length] = new TextRun({text: 'Table '+tableNum+'. ', ...styleTextList})
                        tableNum++;
                    }else if(word===sectionDefault){
                        subsecNum=1;
                        phrase[phrase.length] = new TextRun({text: sectionNum+'. ', ...styleTextList})
                        sectionNum++;
                    }else if(word===subsecDefault){
                        phrase[phrase.length] = new TextRun({text: sectionNum+'.'+subsecNum+'. ', ...styleTextList})
                        subsecNum++;
                    }
                }
                if(word===imgDefault){
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
const createTable = async (textWrote: string, index: number, templateName: string, tableCommand: string) => {
    let response = {};
    let newIndex = index;
    let word = '', phrase = '';
    let rows = [];
    let cels = [];
    
    //get the paragraph style
    let styleFormatList = await getStyleFormatFrom(templateName, tableCommand);
    //get the text style
    let styleTextList = await getStyleTextFrom(templateName, tableCommand);
    
    for(let i=index; i<textWrote.length; i++){
        while(textWrote[i]!=='\n' && textWrote[i]!==' ' && i<textWrote.length){
            word+=textWrote[i];
            i++;
        }
        if(word==='#tablec:'){  //for a while, this command will be constant
            newIndex = i;
            break;
        }else if(word==='#celc:'){ //for a while, this command will be constant
            cels[cels.length] = new TableCell({
                                children: [new Paragraph({children:[new TextRun({text: phrase, ...styleTextList})],})],
                            });
            phrase = '';
        }else if(word==='#rowc:'){ //for a while, this command will be constant
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
const getStyleFormatFrom = async (templateName: string, command: string) => {
    let urlTemplateName = encodeURIComponent(templateName);
    let urlCommand = encodeURIComponent(command);
    let styleCreate = {};
    await api.get('template/command/formatstyle?template='+urlTemplateName+'&command='+urlCommand).then(response => {
        styleCreate = response.data;
    });
    return styleCreate;
}

//Get the style to the text
const getStyleTextFrom = async (templateName: string, command: string) => {
    let urlTemplateName = encodeURIComponent(templateName);
    let urlCommand = encodeURIComponent(command);
    let styleCreate = {}
    await api.get('template/command/textstyle?template='+urlTemplateName+'&command='+urlCommand).then(response => {
        styleCreate = response.data;
    });
    return styleCreate;
}
