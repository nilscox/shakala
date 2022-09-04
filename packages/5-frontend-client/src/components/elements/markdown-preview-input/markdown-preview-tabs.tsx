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
  <div className="gap-2 row" role="tablist">
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
      className="self-end mr-1 ml-auto text-sm text-right text-muted hover:underline"
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
