import * as React from 'react';
import { SVGProps } from 'react';
import { createIcon } from '../Icon';
export const ToggleRightIcon = createIcon(
  <React.Fragment>
    <rect x={1} y={5} width={22} height={14} rx={7} ry={7} />
    <circle cx={16} cy={12} r={3} />
  </React.Fragment>,
  'ToggleRightIcon'
);
