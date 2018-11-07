import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
import React from 'react';
import {
  shallow
} from 'enzyme';

import About from '@/pages/about/pages_about';

describe('about component', function() {
  it('should have class "about"', function() {
    const wrapper = shallow(<About />);
    expect(wrapper.find('.about').exists());
  })
})	