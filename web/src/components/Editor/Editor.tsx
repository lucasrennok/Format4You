import './Editor.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function Editor({ value, onChange }: Props) {
  return (
    <div className="editor">
      <textarea
        className="editor-area"
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva usando os comandos (#title:, #section:, #text: ...)"
        aria-label="Editor de marcação"
      />
    </div>
  );
}
