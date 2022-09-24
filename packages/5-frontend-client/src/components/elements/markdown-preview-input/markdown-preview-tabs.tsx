import { clsx } from 'clsx';

import { Link } from '../link';

export enum Tab {
  edit = 'edit',
  preview = 'preview',
}

type MarkdownPreviewTabsProps = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

export const MarkdownPreviewTabs = ({ tab, setTab }: MarkdownPreviewTabsProps) => (
  <div className="row gap-2" role="tablist">
    <div />
    <TabComponent selected={tab === Tab.edit} onClick={() => setTab(Tab.edit)}>
      Éditer
    </TabComponent>
    <TabComponent selected={tab === Tab.preview} onClick={() => setTab(Tab.preview)}>
      Aperçu
    </TabComponent>
    <Link
      openInNewTab
      to="/mise-en-forme"
      className="mr-1 ml-auto self-end text-right text-xs text-muted hover:underline"
    >
      Aide de mise en forme
    </Link>
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
    className={clsx(
      'relative top-px mt-1 rounded-t border py-1 px-4 font-bold',
      selected && 'border-b-transparent bg-neutral text-primary',
      !selected && 'border-none text-muted',
    )}
  >
    {children}
  </button>
);
