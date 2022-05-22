import classNames from 'classnames';

export enum Tab {
  edit = 'edit',
  preview = 'preview',
}

type TabsProps = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

export const Tabs = ({ tab, setTab }: TabsProps) => (
  <div className="flex flex-row" role="tablist">
    <div className="w-2 border-b border-light-gray" />
    <TabComponent selected={tab === Tab.edit} onClick={() => setTab(Tab.edit)}>
      Éditer
    </TabComponent>
    <div className="w-2 border-b border-light-gray" />
    <TabComponent selected={tab === Tab.preview} onClick={() => setTab(Tab.preview)}>
      Aperçu
    </TabComponent>
    <div className="flex-1 w-2 border-b border-light-gray" />
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
    className={classNames(
      'py-1 px-3 mt-1 font-bold rounded-t border',
      selected && 'text-primary bg-white border-light-gray border-b-transparent',
      !selected && 'text-text-light border-b-light-gray border-transparent',
    )}
  >
    {children}
  </button>
);
