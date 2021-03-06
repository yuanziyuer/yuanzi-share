import React, { Component } from 'react';
import fetch_ from 'isomorphic-fetch';
const fetch = fetch_.bind(this);
import Slider from 'react-slick';
import './style/content.css';
import CommentList from './comments';
import Empty from './empty';
import Helmet from 'react-helmet';
class StrategyComponent extends Component {
	constructor(props) {
		super(props);
		this.state = { strategy:
		{
			photos:[],
			comments:[],
			owner:{
				nickname :''
			},
			soundStory: '',
			score: 0,
			tryCount: 0,
			collectCount: 0,
			description:''
		}
		};
	}

  componentDidMount() {
    fetch('http://www.iyuanzi.net/strategies/'+ this.props.params.id  + '?version=v2')
    .then((result) =>(result.json()))
    .then((json) => {
      this.setState({ strategy: json });

    }).catch((ex) => {
      console.log(ex);
      this.setState({ strategy: null });
    });
  }
	componentWillMount (){
	};

	render() {
    if(this.state.strategy) {
      return <Strategies strategy={ this.state.strategy }/>
    }else {
      return <Empty/>;
    }
  }
};

class Strategies extends Component {
	render() {
    let {strategy} = this.props;
		return (<div className="content">
      <Helmet
        title={this.props.strategy.title}
        titleTemplate="元子育儿 - %s"
        meta={[
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: strategy.cover },
        { property: 'og:title', content: strategy.title },
        { property: 'og:description', content: strategy.subTitle }]
       }
      />
			<div className="strategyTitle">{this.props.strategy.title}</div>
			{this.props.strategy.owner.nickname ? <div className="authorWrap"><span>来自: </span><span
				className="author">{ this.props.strategy.owner.nickname }</span></div> : null
			}
			{
				this.props.strategy.tryCount ? <div className="usedCount">{ this.props.strategy.tryCount +'人参与 ' + ' 综合评分'+this.props.strategy.score +'分  ' + this.props.strategy.score +'人收藏' }</div> : <div className="usedCount"/>
			}
			<div className="audioSection">
				{
					this.props.strategy.soundStory ?
						<audio className="storyAudio" id="story" controls src={ this.props.strategy.soundStory }/> : null
				}
			</div>
			<div className="text" id="text" dangerouslySetInnerHTML={{ __html: this.props.strategy.description }}></div>
      {this.props.strategy.photos.length>0?
        (
          <div className="photoWorks">
            {
              <NonInfinite photos={ this.props.strategy.photos }/>
            }
            </div>
        ):null
      }
			<div className="commentsWrap">
				{
					(<CommentList comments={ this.props.strategy.comments }/>)
				}
			</div>
		</div>);


	};
};

class NonInfinite extends Component {

	render() {
		var settings = {
			dots: false,
			arrows: false,
			infinite: false,
			speed: 100,
			centerMode:false
		};
		return (
			<div>
				{this.props.photos.length ?
					<div>
						<div className="sectionTitle">
							<span className="sectionName">作品 </span>
							<span>({ this.props.photos.length })</span>
						</div>
						<Slider {...settings}>
							{
								this.props.photos.map(function (item) {
									return (<PhotoWorkItem key={item.photoId} photo={item} />);
								})
							}
						</Slider>
					</div> : <div></div>
				}
			</div>
		);
	};
};


class PhotoWorkItem extends Component {
	render () {
		var imgStr = '@140h_140w_1e_1c_1pr';
		var imgSrc = this.props.photo.content[0].img+imgStr;
		return ( <div  className="photoItemWrap" id={ this.props.key }><img className="work" src={imgSrc}/>
			<div className="avatarWrap"><img className="avatarImg" src={ this.props.photo.owner.avatar }/></div>
			<div className="nickname"> { this.props.photo.owner.nickname } </div>
			<div className="like"><img className="likeIcon" src="http://yuanzi-assets.oss-cn-beijing.aliyuncs.com/share%2Fstrategies%2Flike.png" alt="" /><span className="likeCount"> {this.props.photo.praiseCount}</span></div>
		</div>);
	};
};



export default StrategyComponent;

