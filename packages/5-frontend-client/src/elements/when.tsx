type WhenProps = {
  condition: boolean;
  then: React.ReactNode;
  else?: React.ReactNode;
};

export const When = ({ condition, then, else: _else = null }: WhenProps) => {
  if (condition) {
    return <>{then}</>;
  } else {
    return <>{_else}</>;
  }
};
