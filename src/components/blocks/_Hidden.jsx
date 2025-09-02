// src/components/blocks/_Hidden.jsx
/*
 * This block ensures its children are processed and included in the OLX DOM
 * structure but does not display them.
 */

import React from 'react';
import makeVisible from './_Visible';

export default makeVisible(false);
