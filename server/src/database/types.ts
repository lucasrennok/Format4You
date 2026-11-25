// Tipos das linhas de cada tabela, usados como referência e nos controllers.

export interface Spacing {
  id: number;
  before: number; // twips (1/20 pt)
  after: number;
}

export interface Indent {
  id: number;
  firstLine: number;
  hanging: number;
  left: number;
  right: number;
}

export interface TextStyles {
  id: number;
  bold: number; // 0 | 1
  font: string;
  size: number; // meios-pontos (12pt = 24)
  italics: number; // 0 | 1
}

export interface FormatStyles {
  id: number;
  alignment: string; // "both" | "center" | "start" | "end"
  spacing_id: number;
  indent_id: number;
}

export interface TemplateCommand {
  template: string;
  command: string;
  command_type: string;
  text_styles_id: number;
  format_styles_id: number;
}

export interface TemplateMargin {
  template: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
}
