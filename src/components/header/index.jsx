import React, { Component } from 'react'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
//import LinkButton from '../link-button'
//export default不需要加{}
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import './index.less'
import LinkButton from '../link-button'
/*
Header组件
*/
class Header extends Component {

state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    dayPictureUrl: '',
    weather: ''
}

getTime = () => {
    //每隔一秒获取当前时间,并更新数据currentTime
    this.intervalId = setInterval(() => {
        const currentTime = formateDate(Date.now())
        this.setState({currentTime})
    },1000)
}

getWeather = async () => {
    //调用接口异步请求数据
    const {dayPictureUrl, weather, temperature} = await reqWeather('Sydney')
    //更新状态
    this.setState({dayPictureUrl, weather, temperature})
}

getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
        if(item.key === path) { //如果当前item对象的key与path匹配,item的title就是我要显示的title
            title = item.title
        } else if (item.children) {
            // 在所有的子item中查找
            const cItem = item.children.find(cItem => cItem.key === path)
            //如果有值,说明匹配到了
            if(cItem) {
                title = cItem.title
            }
        }
    })
    return title
}

//退出登录
logout = () => {
    //显示确认框
    Modal.confirm({
        title: 'Do you Want to delete these items?',
        content: 'Some descriptions',
        onOk: () => {
          console.log('OK',this);
          //删除用户保存的数据
          storageUtils.removeUser();
          memoryUtils.user = {}
          this.props.history.replace('/login')
        },
        onCancel() {
          console.log('Cancel');
        }
        
      });
    }
        
    
//第一次render()之后执行 一次. 一般在此之行一步操作:
//发ajax请求和启动定时器
componentDidMount () {
    //获取当前的时间
    this.getTime()
    this.getWeather()
    this._isMounted = false;
}
//当前组件写在之前调用
componentWillUnmount () {
    //清除定时器
    clearInterval(this.intervalId)
}
    render() {

        const {currentTime, dayPictureUrl, weather, temperature} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username} </span>
                    {/*  eslint-disable-next-line */}
                    <LinkButton onClick={this.logout}> Log out</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=""></img>
                        <span>{weather}</span>
                        <span className="temp">{temperature}°C</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)