import { DraftCommentKind, ThreadDraftsComments } from 'frontend-domain';
import { useCallback, useEffect, useState } from 'react';

import { ProfileTitle } from '~/app/profile/profile-title';
import { Fallback } from '~/elements/fallback';
import { IconButton } from '~/elements/icon-button';
import { Link } from '~/elements/link';
import { Markdown } from '~/elements/markdown';
import { When } from '~/elements/when';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import IconCross from '~/icons/cross.svg';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated();

const DraftsPage = () => {
  const dispatch = useAppDispatch();
  const [drafts, setDrafts] = useState<Record<string, ThreadDraftsComments>>({});

  useEffect(() => {
    dispatch((dispatch, getState, { draftsGateway }) => {
      return draftsGateway.getAllDrafts();
    }).then(setDrafts);
  }, [dispatch]);

  const clearDraft = useCallback(
    (kind: DraftCommentKind, threadId: string, commentId?: string) => {
      dispatch(async (dispatch, getState, { draftsGateway }) => {
        if (kind === 'root') {
          await draftsGateway.clearDraft('root', threadId);
        } else {
          await draftsGateway.clearDraft(kind, threadId, commentId as string);
        }

        setDrafts(await draftsGateway.getAllDrafts());
      });
    },

    [dispatch],
  );

  return (
    <>
      <ProfileTitle
        title="Brouillons"
        subTitle="Les messages que vous avez commencé à rédiger mais n'avez pas encore publié"
        pageTitle="brouillons"
      />

      <When
        condition={Object.keys(drafts).length > 0}
        then={<Drafts drafts={drafts} clearDraft={clearDraft} />}
        else={<Fallback>Vous n'avez aucun brouillon en cours.</Fallback>}
      />
    </>
  );
};

export default DraftsPage;

type DraftsProps = {
  drafts: Record<string, ThreadDraftsComments>;
  clearDraft: (kind: DraftCommentKind, threadId: string, commentId?: string) => void;
};

const Drafts = ({ drafts, clearDraft }: DraftsProps) => (
  <>
    {Object.entries(drafts).map(([threadId, drafts]) => (
      <div key={threadId} className="col gap-4">
        {drafts.root && (
          <Draft
            text={drafts.root}
            link={`/discussions/${threadId}`}
            onClear={() => clearDraft('root', threadId)}
          />
        )}

        {Object.entries(drafts.replies ?? {}).map(([replyId, text]) => (
          <Draft
            key={replyId}
            text={text}
            link={`/discussions/${threadId}`}
            onClear={() => clearDraft('reply', threadId, replyId)}
          />
        ))}

        {Object.entries(drafts.editions ?? {}).map(([commentId, text]) => (
          <Draft
            key={commentId}
            text={text}
            link={`/discussions/${threadId}`}
            onClear={() => clearDraft('edition', threadId, commentId)}
          />
        ))}
      </div>
    ))}
  </>
);

type DraftProps = {
  text: string;
  link: string;
  onClear: () => void;
};

const Draft = ({ text, link, onClear }: DraftProps) => (
  <div className="card p-2 relative pr-8">
    <Markdown markdown={text} />
    <Link href={link} className="absolute inset-0" />
    <IconButton
      icon={<IconCross className="!m-0" />}
      title="Supprimer"
      className="!absolute top-0 right-0 m-2"
      onClick={onClear}
    />
  </div>
);
