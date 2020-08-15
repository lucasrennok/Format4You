# <img src="/web/src/assets/images/icons/leaf.png" width="80" height="80">Format 4 You
>           *You write we format*

A plataform that format your projects in SBC style, you just need to put your thougths at the paper. Leave the boring job to us and use your time better in your works.

<img src="/web/src/assets/images/background.png" width="450" height="300">

## :newspaper: About it

This project was made with ReactJs in typescript template. The idea is to auto format documents with the template: SBC. It will improove how you spend your time and make easier to do your works.

## :heavy_check_mark: Requirements

<img src="https://miro.medium.com/max/2800/1*y5YLuOKO5XM7MOzve6XsDQ.png" width="300" height="150">
<img src="https://www.trytape.com/wp-content/uploads/2019/10/yarn_image.png" width="200" height="100">

I used: **NPM** and **YARN**

*Obs.: I was having some troubles with NPM at the beggining so I moved to yarn after a while.*

### :arrow_down_small: Downloads:

**WEB:**

 > npm install --save-dev react-router-dom @types/react-router-dom react @types/react react-dom @types/react-dom
 >
 > npm install --save-dev docx
 >
 > npm install --save-dev file-saver
 >
 > npm install --save-dev @types/file-saver
 >
 > yarn add axios
 >
 > yarn add @types/axios

**SERVER:**

 > yarn add express
 >
 > yarn add @types/express
 >
 > yarn add ts-node-dev -D
 >
 > yarn add knex sqlite3
 >
 > yarn add cors
 >
 > yarn add @types/cors

### :boom: Starting it

**WEB:**

Go to the 'web' file and put:
> yarn start

**SERVER:**

Go to the 'server' file and put:
> yarn start

## :abcd: How it works

See:
![how it works](/images/platform.gif)

You can change the document name at 'Document title'.
![document name](/images/documentTitle.PNG)

At Writer you write your article with some commands that will format the text for you. When you finish it, you have to press 'Format' to download the document.
![writer](/images/writer.PNG)

The commands change the text style and format style from the next words, so use them in your favor to format the document for you. When you press 'New file' the Writer will be with a default text to help you, change words and commands to get what you want to.

## Fixed Commands

These are the fixed commands, that don't change when the templates change. So use them at any moment.

Fixed commands can change some configs and change text styles. They even can be used to organize your document or to start a new paragraph from a section.

**Commands:**

- '#template:' Set the template that you will use. And set the margin of the document.(!CONFIG COMMAND!, INPUT = a template)
- '#order:' Set if the sections, subsections, images and tables will be ordered automatically.(!CONFIG COMMAND!, INPUT = true or false)
- '#:' The line will be a commentary, nothing after this command will be shown at the document or change the styles.
- '#b:' This will change the currectly style to bold.
- '#bc:' This will remove bold from currently style.
- '#i:' This will change the currently style to italics.
- '#ic:' This will remove italics from currently style.
- '#n:' This will add a newline, it will break the line at the document, but you can just press 'Enter' in your keyboard to go to the next line.
- '#t:' This is used at paragraphs that are not the first paragraph of a section, it is similar to press 'Tab' in your keyboard.

## :symbols: Templates Commands

Each template have their own commands. To use other command, change the template using '#template:' command and selecting what template commands you want to use momentainely to the next words.

The templates commands change the text style and the format style of the next words.

#### SBC Template

**Commands:**

- '#author:' Used at authors area of the article.
- '#title:' Used at title area of the article.
- '#institute:' Used at authors' institutes area of the article.
- '#email:' Used at e-mail area of the article.
- '#abstract:' Used at abstract area of the article.
- '#resumo:' Used at *resumo* area of the article.
- '#section:' Used to create a new section in the article.
- '#subsec:' Used to create a new subsection in the article.
- '#text:' Used to create a paragraph at a section. Use '#text: #t:' to paragraphs that are not the first from a section, you can also use only '#t:' if the last command used was '#text:'.
- '#ref:' Used to create a new reference in SBC style.
- '#caption:' Used below images to create one line captions.
- '#caption-justified:' Used below images to create long captions that ocuppy more than one line.
- '#img:'
- '#table-title:' Used above tables to create one line table titles.
- '#table-title-justified:' Used above tables to create long table titles that ocuppy more than one line.
- '#table:' Used to create a new table, to add new cells you will have to use '#celc:' after the name of the cell. To end the row, use '#rowc:'. To close the table creation, use '#tablec:'.

OBS.: '#celc:', '#rowc:' and '#tablec' are fixed commands, they are not from this template, but they can only be used if '#table:' appear.

##### :arrow_forward: Table Example:

The commands:

![table text](/images/tableTextExample.PNG)

The result:

![table result](/images/tableDocumentExample.PNG)

#### ABNT Template

**Commands:**

- '#ref:' Used to create a new reference in ABNT style.

## :heavy_plus_sign: How to create new templates

I used [Imsomnia Core](https://insomnia.rest/) to use Post and Get methods, and I recommend to install it to create new templates with Post.

#### :heavy_minus_sign: Create Template Commands
Use the Post method with 'JSON' text.

POST URL:
> http://localhost:3333/template

In the body put a JSON like this:

> {
	"template": "abnt",
	"command": "#ref:",
	"command_type": "referenceabnt",
	"format_styles": {
		"alignment": "left",
		"spacing":{
			"before": 0,
			"after": 240
		},
		"indent":{
			"firstLine": 0,
			"hanging": 0,
			"left": 0,
			"right": 0
		}
	},
	"text_styles":{
		"bold": 0,
		"font": "Times",
		"size": 24,
		"italics": 0
	}
}

Change the values to create commands to a template.

#### :heavy_minus_sign: Create Template Margins
Use the Post method with 'JSON' text.

POST URL:
> http://localhost:3333/template/margins

In the body put a JSON like this:

> {
	"template": "sbc",
	"top": 1985,
	"right": 1700,
	"bottom": 1420,
	"left": 1700
}

Change the values to create a margin to a template.

## :v: Want to help?

- Make a fork
- Send me suggestions
- If you found an error, contact me
- Give a star to this project
- Share this repository with your friends

**Thank you, enjoy it, haha, :wink:**

### 🤔 Future Challenges

1. [x] Put tables and images(charts and pictures)
2. [x] Order the sections(subsections, images, tables and charts) automatically
3. [x] References in ABNT
4. [ ] A way to make references easier (spoiler: autocomplete)
5. [x] Api to manage the templates
6. [ ] Auto translate(abstract->'resumo') (maybe)
7. [ ] Document preview
8. [ ] New templates to format
9. [ ] New extensions to the documents(DOCX -> ODT -> PDF -> script.txt)
10. [x] Page margins for different templates(API and Web)

**Take a screenshot of your chart to put in the document, charts will be treated like images with '#img:'**