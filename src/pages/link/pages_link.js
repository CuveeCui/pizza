import React from 'react';
import '@/pages/link/pages_link.scss';

export default class Login extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className='link'>
        <ul>
          <li><a href="https://xiguacity.cn/" target='_blank' rel="noopener noreferrer">西瓜主页</a></li>
          <li><a href="https://xiguacity.cn/admin" target='_blank' rel="noopener noreferrer">西瓜后台</a></li>
        </ul>
      </div>
    );
  }
}