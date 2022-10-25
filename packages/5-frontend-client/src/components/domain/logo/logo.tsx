import { SVGProps } from 'react';

const point = (x: number, y: number) => ({ x, y, toString: () => `${x},${y}` });
type Point = ReturnType<typeof point>;

type Ballon = {
  center: Point;
  radius: number;
  tip: Point[];
};

const questionCenter = point(8, 7);
const question: Ballon = {
  center: questionCenter,
  radius: 6,
  tip: [
    point(questionCenter.x - 4, questionCenter.y - 2),
    point(questionCenter.x - 7, questionCenter.y + 6),
    point(questionCenter.x + 2, questionCenter.y + 4),
  ],
};

const answerCenter = point(17, 8);
const answer: Ballon = {
  center: answerCenter,
  radius: 5,
  tip: [
    point(answerCenter.x + 3, answerCenter.y - 2),
    point(answerCenter.x + 6, answerCenter.y + 5),
    point(answerCenter.x - 2, answerCenter.y + 3),
  ],
};

type LogoProps = SVGProps<SVGSVGElement> & {
  debug?: boolean;
};

export const Logo = ({ debug, ...props }: LogoProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" {...props}>
    <SpeechBallonQuestion question={question} answer={answer} debug={debug} />
    <SpeechBallonAnswer answer={answer} debug={debug} />
  </svg>
);

export const SpeechBallonQuestion = ({
  question: { center, radius, tip },
  answer,
  debug,
}: {
  question: Ballon;
  answer: Ballon;
  debug?: boolean;
}) => (
  <>
    <circle
      cx={center.x}
      cy={center.y}
      r={radius}
      fill="transparent"
      stroke="currentColor"
      mask="url(#question-circle-mask)"
    />

    <mask id="question-circle-mask">
      <rect x="0" y="0" width="24" height="24" fill="white" />
      <path fill="black" d={`M ${tip[0]} L ${tip[1]} L ${tip[2]} Z`} />
      <circle fill="black" cx={answer.center.x} cy={answer.center.y} r={answer.radius} />
    </mask>

    <path
      fill="transparent"
      stroke="currentColor"
      strokeLinejoin="round"
      d={`M ${tip[0]} L ${tip[1]} L ${tip[2]} Z`}
      mask="url(#question-tip-mask)"
    />

    <mask id="question-tip-mask">
      <rect x="0" y="0" width="24" height="24" fill="white" />
      <circle cx={center.x} cy={center.y} r={radius - 0.5} fill="black" />
    </mask>

    <path
      d={`M ${center} c -0.5 -1.5 0 -3 2 -3 s 3 1 3 3 s -3 2 -3 4`}
      style={{ transform: 'translate(0.9px, 0.5px) scale(70%)' }}
      stroke="currentColor"
      strokeWidth={1.5}
      fill="transparent"
      strokeLinecap="round"
    />

    <circle cx={center.x} cy={center.y + 3} r={0.8} stroke="transparent" fill="currentColor" />

    {/* <text
      x={center.x}
      y={center.y + 1}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="12"
      fontFamily="Concert One"
    >
      ?
    </text> */}

    {debug &&
      tip.map(({ x, y }, index) => <circle key={index} cx={x} cy={y} r={0.1} fill="red" stroke="none" />)}
  </>
);

export const SpeechBallonAnswer = ({
  answer: { center, radius, tip },
  debug,
}: {
  answer: Ballon;
  debug?: boolean;
}) => (
  <>
    <circle
      cx={center.x}
      cy={center.y}
      r={radius}
      fill="transparent"
      stroke="currentColor"
      mask="url(#answer-circle-mask)"
    />

    <mask id="answer-circle-mask">
      <rect x="0" y="0" width="24" height="24" fill="white" />
      <path strokeWidth={0.1} fill="black" d={`M ${tip[0]} L ${tip[1]} L ${tip[2]} Z`} />
    </mask>

    <path
      fill="transparent"
      stroke="currentColor"
      strokeLinejoin="round"
      d={`M ${tip[0]} L ${tip[1]} L ${tip[2]} Z`}
      mask="url(#answer-tip-mask)"
    />

    <mask id="answer-tip-mask">
      <rect x="0" y="0" width="24" height="24" fill="white" />
      <circle cx={center.x} cy={center.y} r={radius - 0.5} fill="black" />
    </mask>

    <circle cx={center.x - 2.5} cy={center.y} r={0.8} stroke="transparent" fill="currentColor" />
    <circle cx={center.x} cy={center.y} r={0.8} stroke="transparent" fill="currentColor" />
    <circle cx={center.x + 2.5} cy={center.y} r={0.8} stroke="transparent" fill="currentColor" />

    {/* <text
      x={center.x}
      y={center.y - 1.5}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="10"
      fontFamily="Concert One"
    >
      ...
    </text> */}

    {debug &&
      tip.map(({ x, y }, index) => <circle key={index} cx={x} cy={y} r={0.1} fill="red" stroke="none" />)}
  </>
);
