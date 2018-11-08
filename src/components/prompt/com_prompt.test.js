// 针对该组件，需要测试传入的title和content是正确的
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
import React from 'react';
import {
  shallow
} from 'enzyme';
import { expect } from 'chai';
import Prompt from '@/components/prompt/com_prompt';
describe('测试 <Prompt />', () => {
  it(`传入的title是: '提示'，内容是：'你好美'`, () =>{
  	const title = '提示';
  	const content = '你好美';
    const wrapper = shallow(<Prompt title={title} content={content} />);
    expect(wrapper.find('.prompt-title').text()).to.equal('提示');
    expect(wrapper.find('.prompt-content').text()).to.equal('你好美');
  })
})