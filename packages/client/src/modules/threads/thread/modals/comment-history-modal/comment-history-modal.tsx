import { AuthorDto, CommentDto, MessageDto } from '@shakala/shared';
import { useState } from 'react';

import { PageTitle } from '~/app/page-title';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Diff } from '~/elements/diff/diff';
import { IconButton } from '~/elements/icon-button';
import { Modal, useModalState } from '~/elements/modal';
import { useSearchParam } from '~/hooks/use-search-params';
import ChevronLeft from '~/icons/chevron-left.svg';
import ChevronRight from '~/icons/chevron-right.svg';
import Cross from '~/icons/cross.svg';
import { DateFormat, formatDate } from '~/utils/date-utils';

import { FetchComment } from '../fetch-comment';

export const CommentHistoryModal = () => {
  const [commentId, setHistoryCommentId] = useSearchParam('historique');
  const { isOpen, closeModal } = useModalState(commentId);

  return (
    <Modal
      isOpen={isOpen}
      className="col max-h-full max-w-6"
      onRequestClose={closeModal}
      onAfterClose={() => setHistoryCommentId(undefined)}
    >
      {commentId && (
        <FetchComment commentId={commentId} onNotFound={closeModal}>
          {(comment) => <CommentHistory comment={comment} onClose={closeModal} />}
        </FetchComment>
      )}
    </Modal>
  );
};

type CommentHistoryProps = {
  comment: CommentDto;
  onClose: () => void;
};

const CommentHistory = ({ comment, onClose }: CommentHistoryProps) => {
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

      <hr className="mt-1" />

      <div className="col flex-1 overflow-hidden">
        <div className="row my-2">
          {[before, after].map(({ date }, index) => (
            <Date key={index} date={date} />
          ))}
        </div>

        <Diff before={before.text} after={after.text} className="min-h-1 overflow-y-auto" />
      </div>
    </>
  );
};

type HeaderProps = {
  author: AuthorDto;
  version: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
};

const Header = ({ author, version, onPrev, onNext, onClose }: HeaderProps) => (
  <div className="grid grid-cols-3 items-center">
    <AvatarNick size="medium" nick={author.nick} image={author.profileImage} />
    <VersionSelector version={version} onPrev={onPrev} onNext={onNext} />
    <IconButton className="ml-auto self-start" icon={<Cross />} onClick={onClose} />
  </div>
);

type VersionSelectorProps = {
  version: number;
  onPrev?: () => void;
  onNext?: () => void;
};

const VersionSelector = ({ version, onPrev, onNext }: VersionSelectorProps) => (
  <div className="row mx-auto gap-1">
    <IconButton
      disabled={!onPrev}
      icon={<ChevronLeft />}
      className="text-muted disabled:text-muted/50"
      title="Version précédente"
      onClick={onPrev}
    />

    <div className="text-sm font-semibold uppercase text-muted">Édition {version}</div>

    <IconButton
      disabled={!onNext}
      icon={<ChevronRight />}
      className="text-muted disabled:text-muted/50"
      title="Version suivante"
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
      {formatDate(date, DateFormat.full)}
    </time>
  </div>
);
