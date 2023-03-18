declare module '*.svg' {
  import * as React from 'react';

  export default React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;
}
