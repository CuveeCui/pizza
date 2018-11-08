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
    const promptWrapper = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'left': 0,
      'top': 0,
      'backgroundColor': 'rgba(7,17,27,0.8)'
    };
    const promptContent = {
      'position': 'absolute',
      'width': 300,
      'height': 400,
      'left': '50%',
      'top': '50%',
      'margin-top': 100,
      'transform': 'translateX(-50%)',
      'backgroundColor': '#fff'
    };
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