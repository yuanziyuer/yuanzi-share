import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import Slider from 'react-slick'
import moment from 'moment'

if (process.env.BROWSER) {
	require("./style/content.css");
	require("./style/strategy.css");
}

class StrategyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { strategy:
        {
            photos:[],
            comments:[],
            owner:{
                nickname :""
            },
            soundStory: "",
            score: 0,
            tryCount :0,
            description:""
        }
        };
    }
    componentWillMount (){
        fetch('http://101.251.204.42:3010/strategies/'+ this.props.params.id  + '?version=v2')
            .then((response) => response.json())
            .then((data) => {
	            console.log(data)
                this.setState({strategy: data});
                console.log(this.state)
            })
            .catch((ex) => {
                console.log('fetch failed', ex);
            });
    }

  render() {
    return (
      <div className="content">
          {
              <Strategies strategy = {this.state.strategy}/>
          }
      </div>
    );
  }
}

class Strategies extends Component {
    render() {
        return ( <div className="content">
            <div className="strategyTitle">{this.props.strategy.title}</div>
            <div className="authorWrap"><span>来自: </span><span className="author">{this.props.strategy.owner.nickname}</span></div>

            {
                this.props.strategy.tryCount ?   <div className="usedCount">{this.props.strategy.tryCount +'人参与' + " 综合评分"+this.props.strategy.score +'分  ' + this.props.strategy.score +'人收藏'}</div> : <div className="usedCount"/>
            }
            <div className="audioSection">
                {
                    this.props.strategy.soundStory ?
                        <audio className="storyAudio" id="story" controls src={this.props.strategy.soundStory}></audio> : null
                }
            </div>
            <div  className="text" id="text" dangerouslySetInnerHTML={{__html: this.props.strategy.description}}/>
            <div className="photoWorks">
                {
                    (<NonInfinite photos={this.props.strategy.photos}/>)
                }
            </div>
            <div className="commentsWrap">
                {
                    (<CommentList comments={this.props.strategy.comments}/>)
                }
            </div>
        </div>);
    }
}

class NonInfinite extends Component {

  render() {
      var settings = {
          dots: false,
          arrows: false,
          infinite: false,
          speed: 100,
          slidesToShow: 1,
          centerMode:false
      };
    return (
        <div>
            {this.props.photos.length ?
                <div>
                    <div className="sectionTitle">
                        <span className="sectionName">作品 </span>
                        <span>({this.props.photos.length})</span>
                    </div>
                    <Slider {...settings}>
                        {
                            this.props.photos.map(function (item) {
                                return (<PhotoWorkItem key={item.photoId} photo={item}></PhotoWorkItem>);
                            })
                        }
                    </Slider>
                </div> : <div></div>
            }
        </div>
    );
  }
}


class PhotoWorkItem extends Component {
    render () {
        var imgStr = '@140h_140w_1e_1c_1pr';
        var imgSrc = this.props.photo.content[0].img;
        return ( <div  className="photoItemWrap" id={this.props.key}><img className="work" src={imgSrc}/>
            <div className="avatarWrap"><img className="avatarImg" src={this.props.photo.owner.avatar}/></div>
            <div className="nickname"> {this.props.photo.owner.nickname} </div>
            <div className="like"><img className="likeIcon" src="http://yuanzi-assets.oss-cn-beijing.aliyuncs.com/share%2Fstrategies%2Flike.png" alt="" /><span className="likeCount"> {this.props.photo.praiseCount}</span></div>
        </div>);
    }
}

class CommentList extends Component {
    render () {
        return (<div>
            {
                this.props.comments.length ?
                    <div>
                        <div className="sectionTitle">
                            <span className="sectionName">评论 </span>
                            <span>({this.props.comments.length})</span>
                        </div>
                        <ul className="commentList"> {
                            this.props.comments.map(function(item) {
                                return (<CommentItem {...item} key={item.commentId}></CommentItem>);
                            })
                        }
                        </ul>
                    </div>
                     : <div></div>
            }
        </div>)
    }
}

class CommentItem extends Component {
    render () {
        moment().format();
        moment.locale('zh-cn');
        return (<li className="commentItem">
            <div className="commentItemWrap">
                <div className="avatarWrap"><img src={this.props.commentUser.avatar} alt="" className="avatarImg"/></div>
                <div className="nicknameWrap"><span className="nickname">{this.props.commentUser.nickname}</span></div>
                <span className="time"> {moment(this.props.createdAt).fromNow()}</span>
                <div className="commentText">{this.props.content}</div>
            </div>
        </li>);
    }
}

export default StrategyComponent;

