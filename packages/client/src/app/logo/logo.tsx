import { SVGProps } from 'react';

const point = (x: number, y: number) => ({ x, y, toString: () => `${x},${y}` });
type Point = ReturnType<typeof point>;

const width = 48;
const height = 32;
const strokeWidth = 1.7;

type LogoProps = SVGProps<SVGSVGElement> & {
  debug?: boolean;
};

export const Logo = ({ debug, ...props }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    {...props}
  >
    <Question debug={debug} />
    <Answer debug={debug} />
  </svg>
);

const questionCenter = point(16, 16);
const questionRadius = 15;
const questionTip = [
  point(questionCenter.x - 8, questionCenter.y - 8),
  point(questionCenter.x - questionRadius, questionCenter.y + questionRadius),
  point(questionCenter.x + 8, questionCenter.y + 8),
];

const Question = ({ debug }: { debug?: boolean }) => (
  <>
    <circle
      mask="url(#question-circle-mask)"
      fill="transparent"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      cx={questionCenter.x}
      cy={questionCenter.y}
      r={questionRadius}
    />

    <Mask id="question-circle-mask">
      <path fill="black" d={`M ${questionTip.join(' L ')} Z`} />
      <circle fill="black" cx={answerCenter.x} cy={answerCenter.y} r={answerRadius} />
    </Mask>

    <path
      mask="url(#question-tip-mask)"
      fill="transparent"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      d={`M ${questionTip.join(' L ')} Z`}
    />

    <Mask id="question-tip-mask">
      <circle cx={questionCenter.x} cy={questionCenter.y} r={questionRadius - strokeWidth / 2} fill="black" />
    </Mask>

    <path
      fill="transparent"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      transform="translate(-4 -4)"
      d={`M ${questionCenter} c 0,-1 1,-3 4,-3 c 4,0 5,3 4,5 s -4,3 -4,5`}
    />

    <circle
      fill="currentColor"
      stroke="transparent"
      cx={questionCenter.x}
      cy={questionCenter.y + questionRadius / 2}
      r={questionRadius / 10}
    />

    {debug && <DebugPoints points={questionTip} />}
  </>
);

const answerCenter = point(35, 19);
const answerRadius = 12;
const answerTip = [
  point(answerCenter.x + 7, answerCenter.y - 7),
  point(answerCenter.x + answerRadius, answerCenter.y + answerRadius),
  point(answerCenter.x - 7, answerCenter.y + 7),
];

const Answer = ({ debug }: { debug?: boolean }) => (
  <>
    <circle
      mask="url(#answer-circle-mask)"
      fill="transparent"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      cx={answerCenter.x}
      cy={answerCenter.y}
      r={answerRadius}
    />

    <Mask id="answer-circle-mask">
      <path fill="black" d={`M ${answerTip.join(' L ')} Z`} />
    </Mask>

    <path
      mask="url(#answer-tip-mask)"
      fill="transparent"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      d={`M ${answerTip.join(' L ')} Z`}
    />

    <Mask id="answer-tip-mask">
      <circle cx={answerCenter.x} cy={answerCenter.y} r={answerRadius - strokeWidth / 2} fill="black" />
    </Mask>

    {[-answerRadius * 0.4, 0, answerRadius * 0.4].map((x) => (
      <circle
        key={x}
        fill="currentColor"
        stroke="transparent"
        cx={answerCenter.x + x}
        cy={answerCenter.y}
        r={answerRadius / 8}
      />
    ))}

    {debug && <DebugPoints points={answerTip} />}
  </>
);

const Mask = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <mask id={id}>
    <rect x="0" y="0" width={width} height={height} fill="white" />
    {children}
  </mask>
);

const DebugPoints = ({ points }: { points: Point[] }) => (
  <>
    {points.map(({ x, y }, index) => (
      <circle key={index} cx={x} cy={y} r={0.2} fill="red" stroke="none" />
    ))}
  </>
);
