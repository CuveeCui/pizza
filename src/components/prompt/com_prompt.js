/**
 * @desc: 弹窗组件
 * @param: [title][String][弹窗标题]
 * @param: [content][String][弹窗内容]
 * @return: react component
 * @example: <div>
 *            <Prompt title={title} content={content} />
 *           </div>
 */
import React from 'react';
// import '@/components/prompt/com_prompt.scss';
class Prompt extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='prompt-wrapper'>
        <div className='prompt-content-wrapper'>
          <div className='prompt-title'>
            {this.props.title}
          </div>
          <div className='prompt-content'>
            {this.props.content}
          </div>
        </div>
      </div>
    )
  }
}
export default Prompt;