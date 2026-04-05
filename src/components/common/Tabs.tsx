import { cn } from '../../utils';

export default function Tabs({ tabs, activeTab, onChange }: any) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={cn('tabs__tab', activeTab === tab.key && 'tabs__tab--active')}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
