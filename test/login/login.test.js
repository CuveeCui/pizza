import React from 'react';
import {
  shallow
} from 'enzyme';

import Login from '../../src/pages/login/pages_login';

describe('login component', function() {
  it('should have class "login"', function() {
    const wrapper = shallow(<Login />);
    expect(wrapper.find('.login').exists());
  })
})