import * as React from 'react';
import { SVGProps } from 'react';
import { createIcon } from '../Icon';
export const SearchIcon = createIcon(
  <React.Fragment>
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </React.Fragment>,
  'SearchIcon'
);
