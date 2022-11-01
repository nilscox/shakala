import { Fragment } from 'react';

import { makeDiff } from './make-diff';

const DiffLine: React.FC<{ chunks: Diff.Change[] }> = ({ chunks }) => (
  <Fragment>
    {chunks.map((chunk, n) => (
      <DiffChunk key={n} chunk={chunk} />
    ))}
  </Fragment>
);

const DiffChunk: React.FC<{ chunk: Diff.Change }> = ({ chunk: { value, added, removed } }) => {
  if (added) {
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    return <ins className="bg-[#4ddf5933] no-underline">{value}</ins>;
  }

  if (removed) {
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    return <del className="bg-[#df4d4d33] no-underline">{value}</del>;
  }

  return <Fragment>{value}</Fragment>;
};

type DiffProps = {
  className?: string;
  before: string;
  after: string;
};

export const Diff = ({ className, before, after }: DiffProps) => {
  const lines = makeDiff(before, after, { simplify: true, group: true });

  return (
    <div className={className}>
      {lines.map(([left, right], n) => (
        <div key={n} className="row">
          <div className="flex-1" aria-label="before">
            <DiffLine chunks={left} />
          </div>

          <div className="mx-2 border-l" />

          <div className="flex-1" aria-label="after">
            <DiffLine chunks={right} />
          </div>
        </div>
      ))}
    </div>
  );
};
