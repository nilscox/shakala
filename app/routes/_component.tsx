import { Button } from '~/components/elements/button';

export default function ComponentRoute() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Component />
    </div>
  );
}

const Component = () => {
  return (
    <Button loading className="button-primary">
      Click me!
    </Button>
  );
};
