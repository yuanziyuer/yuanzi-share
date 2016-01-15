/**
 * Created by natefang on 1/14/16.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import moment from 'moment'
if (process.env.BROWSER) {
	require("./style/content.css");
	require("./style/topic.css");
}

class Topic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: {
                strategies:[],
                owner:{
                    nickname :""
                },
                cover: "",
                score: 0,
                tryCount :0,
                description:""
            }};
    }
    componentWillMount (){
	    //var id = document.URL.split("/").slice(-1)[0];
        fetch('http://101.251.204.42:3010/topics/'+ this.props.params.id + '?version=v2')
            .then((response) => response.json())
            .then((data) => {
                this.setState({topic: data});
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
                    <Topics topic = {this.state.topic}/>
                }
            </div>
        );
    }
}

class Topics extends Component {
    render () {
        return (
            <div className="topics"><img className="coverImg" src={this.props.topic.cover}/>
                <div className="topicTitle">{this.props.topic.title}</div>
                <div className="authorWrap"><span> 来自: </span><span className="author">{this.props.topic.owner.nickname}</span></div>
                <div className="descrption">{this.props.topic.content}</div>
                <StrategiesCollections strategies={this.props.topic.strategies}/>
            </div>
        );
    }
}

class StrategiesCollections extends  Component {
    render () {
        return (
            <div>
                {
                    this.props.strategies.length ? <div>
                        <div className="sectionTitle">
                            <span className="sectionName">妙招 </span>
                            <span>({this.props.strategies.length})</span>
                        </div>
                        <ul className="strategyiesCollection">
                            {
                                this.props.strategies.map(function(item) {
                                    return (<StrategyItem key={item.strategyId} {...item}></StrategyItem>);
                                })
                            }
                        </ul>
                    </div> : null

                }
            </div>
        );
    }
}

class StrategyItem extends Component {
    render () {
        return (
            <li className="strategyItem">
                <div className="strategyItemWrap"><img src={this.props.cover} alt="" className="strategyCover"/>
                    <div className="title">{this.props.title}</div>
                    <div className="authorWrap"><span>by </span><span className="author">{this.props.owner.nickname}</span></div>
                    <div className="separator"></div>
                    <div className="score">{ this.props.tryCount+"人参与 / " + this.props.score+"分" } </div>
                </div></li>
        );
    }
}

export default Topic;

