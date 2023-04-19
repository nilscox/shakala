import { AuthorDto, ThreadDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

import { PageTitle } from '~/app/page-title';
import { TOKENS } from '~/app/tokens';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { DateTime } from '~/elements/date-time';
import { IconButton } from '~/elements/icon-button';
import { RichText } from '~/elements/rich-text';
import { useBoolean } from '~/hooks/use-boolean';
import { useInvalidateQuery } from '~/hooks/use-query';
import IconEdit from '~/icons/edit.svg';
import { DateFormat, formatDate } from '~/utils/date-utils';
import { getQueryKey, getQueryKeyWithoutParams } from '~/utils/query-key';

import { ThreadForm } from '../thread-form';

import { ThreadComments } from './thread-comments';
import { ThreadFilters } from './thread-filters';

type ThreadProps = {
  thread: ThreadDto;
};

export const Thread = ({ thread }: ThreadProps) => (
  <>
    <PageTitle>{`${thread.author.nick} : ${thread.text}`}</PageTitle>
    <ThreadMeta {...thread} />

    <div className="my-5 md:my-10">
      <ThreadContent thread={thread} />
    </div>

    <ThreadFilters thread={thread} className="mb-4" />

    <ThreadComments thread={thread} />
  </>
);

type ThreadMetaProps = {
  description: string;
  keywords: string[];
};

const ThreadMeta = ({ description, keywords }: ThreadMetaProps) => (
  <Helmet>
    <meta name="description" content={description}></meta>
    <meta name="keywords" content={keywords.join(', ')}></meta>
  </Helmet>
);

type ThreadContentProps = {
  thread: ThreadDto;
};

const ThreadContent = ({ thread }: ThreadContentProps) => {
  const [editing, setEditing, closeEditionForm] = useBoolean(false);

  if (editing) {
    return <ThreadEditionForm thread={thread} closeEditionForm={closeEditionForm} />;
  }

  return (
    <>
      <ThreadHeader {...thread} />
      <RichText className="card p-4 sm:p-5">{thread.text}</RichText>
      <div className="row mt-1 justify-end text-sm">
        <IconButton icon={<IconEdit />} className="text-muted" onClick={setEditing}>
          Éditer
        </IconButton>
      </div>
    </>
  );
};

type ThreadHeaderProps = {
  author: AuthorDto;
  date: string;
  edited: false | string;
  description: string;
  totalComments: number;
};

const ThreadHeader = ({ author, date, edited, description, totalComments }: ThreadHeaderProps) => (
  <div className="row mb-2 flex-wrap items-center gap-4">
    <AvatarNick size="medium" nick={author.nick} image={author.profileImage} />

    <div className="flex-1 border-l-2 pl-2 font-medium text-muted line-clamp-1">{description}</div>

    <div className="text-muted">
      <DateTime
        date={date}
        title={edited ? `Édité ${formatDate(edited, DateFormat.full).toLowerCase()}` : undefined}
        className={clsx(edited && 'italic')}
      />
      , {totalComments} commentaires
    </div>
  </div>
);

type ThreadEditionFormProps = {
  thread: ThreadDto;
  closeEditionForm: () => void;
};

const ThreadEditionForm = ({ thread, closeEditionForm }: ThreadEditionFormProps) => {
  const threadAdapter = useInjection(TOKENS.thread);
  const invalidate = useInvalidateQuery();

  return (
    <ThreadForm
      initialValues={{
        description: thread.description,
        keywords: thread.keywords.join(' '),
        text: thread.text,
      }}
      submitButtonText="Valider"
      onCancel={closeEditionForm}
      onSubmit={async (fields) => {
        await threadAdapter.editThread(thread.id, fields);
        return thread.id;
      }}
      onSubmitted={() => {
        closeEditionForm();
        invalidate(getQueryKeyWithoutParams(TOKENS.thread, 'getLastThreads'));
        invalidate(getQueryKey(TOKENS.thread, 'getThread', thread.id));
      }}
    />
  );
};
