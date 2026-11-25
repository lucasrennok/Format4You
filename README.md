# <img src="web/src/assets/images/icons/leaf.png" width="40" height="40"> Format4You

> *Você escreve, a gente formata.*

Escreva um documento usando comandos simples de marcação e veja o resultado
tomando forma ao lado, em tempo real (estilo Overleaf). Quando terminar, baixe
em **.docx**.

Projeto antigo da faculdade, reescrito: a parte web foi migrada para Vite +
React 18, separada em componentes e ganhou uma pré-visualização ao vivo.

## :sparkles: Como é

- **Editor + pré-visualização** lado a lado
- **Marcação simples**: título, autor, resumo, seções, subseções, imagens,
  legendas, tabelas e referências
- **Numeração automática** de seções, figuras e tabelas (`#order: true`)
- **Exporta para .docx** usando a biblioteca [`docx`](https://docx.js.org/)
- Roda **inteiramente no navegador** — nada é enviado a servidor nenhum

## :rocket: Rodando a web

Requer Node.js 20.19+.

```sh
cd web
npm install
npm run dev        # http://localhost:3000
```

Para gerar a versão de produção: `npm run build` (sai em `web/dist/`).

## :pencil: A marcação

Cada comando começa com `#` e termina em `:`. Exemplos:

```
#order: true
#title: Título do artigo
#author: Nome do autor
#abstract: #b: Abstract. #bc: texto do resumo
#section: Introdução
#text: Primeiro parágrafo da seção.
#img: https://exemplo.com/figura.png 200 200
#caption: Legenda da figura.
#table:
Nome #celc: Idade #celc: #rowc:
Ana #celc: 20 #celc: #rowc:
#tablec:
#ref: SOBRENOME, N. Título. Editora, 2020.
#: isto é um comentário
```

- `#b:` / `#bc:` ligam e desligam **negrito**; `#i:` / `#ic:` o *itálico*.
- A lista completa de comandos fica no botão **"? Comandos"** dentro do editor.

## :file_cabinet: Pasta `server/` (opcional)

A web atual já traz o template padrão embutido e **não precisa do servidor**
para funcionar. O servidor é opcional e serve para quem quiser um sistema de
**múltiplos templates** editável: ele guarda, em SQLite, os estilos de cada
template (comandos, estilos de texto e de parágrafo, margens) e os expõe por
uma API.

Foi modernizado (Node + TypeScript em ESM, Express 5, Knex + better-sqlite3,
migrations e seed do template SBC). Veja [`server/README.md`](server/README.md)
para rodar.
