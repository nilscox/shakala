import { clsx } from 'clsx';

export enum Tab {
  edit = 'edit',
  preview = 'preview',
}

type MarkdownPreviewTabsProps = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

export const MarkdownPreviewTabs = ({ tab, setTab }: MarkdownPreviewTabsProps) => (
  <div className="row" role="tablist">
    <div className="w-2" />
    <TabComponent selected={tab === Tab.edit} onClick={() => setTab(Tab.edit)}>
      Éditer
    </TabComponent>
    <div className="w-2" />
    <TabComponent selected={tab === Tab.preview} onClick={() => setTab(Tab.preview)}>
      Aperçu
    </TabComponent>
    <div className="flex-1 w-2" />
  </div>
);

type TabComponentProps = {
  selected: boolean;
  onClick: () => void;
  children: string;
};

const TabComponent = ({ selected, onClick, children }: TabComponentProps) => (
  <button
    type="button"
    role="tab"
    onClick={onClick}
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    className={clsx(
      'relative top-[1px] py-1 px-4 mt-1 font-bold rounded-t border',
      selected && 'text-primary bg-neutral border-b-transparent',
      !selected && 'text-muted border-none',
    )}
  >
    {children}
  </button>
);
