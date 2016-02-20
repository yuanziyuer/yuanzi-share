/**
 * Created by diwu on 2/20/16.
 */
import React, { Component } from 'react';
import moment from 'moment';
moment().format();
moment.locale('zh-cn');
class CommentList extends Component {
  render () {
    return (<div>
      {
        this.props.comments.length ?
          <div>
            <div className="sectionTitle">
              <span className="sectionName">评论 </span>
              <span>({ this.props.comments.length })</span>
            </div>
            <ul className="commentList"> {
              this.props.comments.map(function(item) {
                return (<CommentItem {...item} key={item.commentId} />);
              })
            }
            </ul>
          </div>
          : <div></div>
      }
    </div>);
  };
};

class CommentItem extends Component {
  render () {
    return (<li className="commentItem">
      <div className="commentItemWrap">
        <div className="avatarWrap"><img src={ this.props.commentUser.avatar } className="avatarImg"/></div>
        <div className="nicknameWrap"><span className="nickname">{ this.props.commentUser.nickname }</span></div>
        <span className="time"> { moment(this.props.createdAt).fromNow() }</span>
        <div className="commentText">{ this.props.content }</div>
      </div>
    </li>);
  };
};

export default CommentList;
