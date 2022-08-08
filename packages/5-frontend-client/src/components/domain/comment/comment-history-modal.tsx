import { formatDate, selectComment, User } from 'frontend-domain';
import { useState } from 'react';
import { MessageDto } from 'shared';

import { AvatarNick } from '~/components/elements/avatar/avatar-nick';
import { Diff } from '~/components/elements/diff/diff';
import { IconButton } from '~/components/elements/icon-button';
import { Modal } from '~/components/elements/modal';
import { PageTitle } from '~/components/layout/page-title';
import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';
import { useSelector } from '~/hooks/use-selector';
import ChevronLeft from '~/icons/chevron-left.svg';
import ChevronRight from '~/icons/chevron-right.svg';
import Cross from '~/icons/cross.svg';

export const CommentHistoryModal = () => {
  const commentId = useSearchParam('historique');
  const [requestClose, setRequestClose] = useState(false);
  const setSearchParam = useSetSearchParam();

  const handleClose = () => {
    setRequestClose(true);

    setTimeout(() => {
      setRequestClose(false);
      setSearchParam('historique', undefined);
    }, 200);
  };

  return (
    <Modal
      isOpen={!requestClose && Boolean(commentId)}
      // eslint-disable-next-line tailwindcss/no-arbitrary-value
      className="max-w-[64rem]"
      onRequestClose={handleClose}
    >
      {commentId && <CommentHistory commentId={commentId} onClose={handleClose} />}
    </Modal>
  );
};

type CommentHistoryProps = {
  commentId: string;
  onClose: () => void;
};

const CommentHistory = ({ commentId, onClose }: CommentHistoryProps) => {
  const comment = useSelector(selectComment, commentId);

  const history: MessageDto[] = [...comment.history, { text: comment.text, date: comment.edited as string }];
  const [version, setVersion] = useState(history.length - 1);

  const before = history[version - 1];
  const after = history[version];

  return (
    <>
      <PageTitle>{`Historique d'édition du commentaire de ${comment.author.nick}`}</PageTitle>

      <Header
        author={comment.author}
        version={version}
        onPrev={version > 1 ? () => setVersion(version - 1) : undefined}
        onNext={version < history.length - 1 ? () => setVersion(version + 1) : undefined}
        onClose={onClose}
      />

      <hr className="mt-1 mb-2" />

      <div className="my-2 row">
        {[before, after].map(({ date }, index) => (
          <Date key={index} date={date} />
        ))}
      </div>

      <Diff before={before.text} after={after.text} />
    </>
  );
};

type HeaderProps = {
  author: User;
  version: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
};

const Header = ({ author, version, onPrev, onNext, onClose }: HeaderProps) => (
  <div className="items-center row">
    <AvatarNick big nick={author.nick} image={author.profileImage} />
    <VersionSelector version={version} onPrev={onPrev} onNext={onNext} />
    <IconButton className="self-start ml-auto" icon={<Cross />} onClick={onClose} />
  </div>
);

type VersionSelectorProps = {
  version: number;
  onPrev?: () => void;
  onNext?: () => void;
};

const VersionSelector = ({ version, onPrev, onNext }: VersionSelectorProps) => (
  <div className="gap-1 ml-4 row">
    <IconButton
      disabled={!onPrev}
      icon={<ChevronLeft />}
      className="text-muted disabled:text-muted/50"
      onClick={onPrev}
    />

    <>Version {version}</>

    <IconButton
      disabled={!onNext}
      icon={<ChevronRight />}
      className="text-muted disabled:text-muted/50"
      onClick={onNext}
    />
  </div>
);

type DateProps = {
  date: string;
};

const Date = ({ date }: DateProps) => (
  <div className="flex-1 text-center">
    <time dateTime={date} className="font-semibold text-muted">
      {formatDate(date, "'Le' d MMMM yyyy 'à' HH:mm")}
    </time>
  </div>
);