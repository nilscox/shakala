import type { NextApiRequest, NextApiResponse } from 'next';

import { getPublicConfig } from '~/utils/config';

const { version } = getPublicConfig();

const getAppVersion = (req: NextApiRequest, res: NextApiResponse<string>) => {
  res.status(200).send(version);
};

export default getAppVersion;
