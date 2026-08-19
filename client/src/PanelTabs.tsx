import './panel-shell.css';

export type PanelTab = { id: string; label: string; disabled?: boolean };

type Props = {
  name: string;
  items: PanelTab[];
  value: string;
  onChange: (id: string) => void;
};

export default function PanelTabs({ name, items, value, onChange }: Props) {
  return (
    <div className="dp-tabs" role="tablist" aria-label={name}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          disabled={item.disabled}
          className={value === item.id ? 'is-on' : ''}
          onClick={() => {
            onChange(item.id);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
