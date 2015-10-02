'use strict';

import React from 'react-native';
import Dimensions from 'Dimensions';

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  AlertIOS,
  NavigatorIOS,
  TouchableHighlight,
  ScrollView,
  Image
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var styles = StyleSheet.create({
    scrollView : {
        marginTop : 0,
        backgroundColor : '#ddd',
        flexDirection: 'column'
    },
    navigator : {
        flex : 1
    },
    row : {
        backgroundColor : '#ccc',
        margin : 10,
        padding : 10,
        flexDirection : 'row',
        flexWrap : 'wrap',
        width : deviceWidth - 20
    },
    image : {
        width: 64,
        height: 64
    },
    imageWrap : {
        flex : 3
    },
    textWrap : {
        flex : 7
    },
    dest : {
        paddingTop : 74
    }
});



class MyDest extends Component {
    render() {
        return (
            <View style={styles.dest}>
                <Text>{ this.props.contents }</Text>
            </View>
        );
    }
}
class MyView extends Component {

    static defaultProps = {
        title : "DEFAULT"
    };

    componentDidMount(){
    }

    _handlePress() {
        //const { refs : { navigator }} = this.props;
        //console.log("navigator" , navigator);
        const {data} = this.props;
        this.props.root.refs.navigator.push({
            title: data.title,
            component: MyDest,
            passProps: {
                contents     :  data.contents
            }
        });
    }

    render() {
        const { data } = this.props;
        return (
            <TouchableHighlight onPress={this._handlePress.bind(this)}>
                <View style={styles.row}>
                    {data.imageUrl != "" &&
                        <View style={styles.imageWrap}>
                            <Image style={styles.image} source={{ uri : data.imageUrl}}></Image>
                        </View>
                    }
                    <View style={styles.textWrap}>
                        <Text>{data.title}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

class MyScrollView extends Component {

    constructor(props) {
        super(props);
        this.state = { list: [] };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData(){
        fetch('http://media.daum.net/api/service/news/list/important/enter.json')
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    list : json.simpleNews
                })
            });
    }

    render() {
        //console.log("orientation", this.state.orientation);
        return (
            <ScrollView
                onScroll={() => { console.log('onScroll!'); }}
                scrollEventThrottle={200}
                style={styles.scrollView}
                contentInset={{top: -50}}>
                {this.state.list.map((data) => <MyView key={data.newsId} data={data} root={this.props.root}/>)}
            </ScrollView>
        );
    }
}


class App extends Component {



    componentDidMount() {
		console.log('App started');
    }

    //_handleNavigator(title) {
    //    console.log("title");
    //    this.refs.navigator.push({
    //        title: title,
    //        component: MyView,
    //        passProps: {
    //            title     : title,
    //            navigator : this.refs.navigator
    //        }
    //    });
    //}


	render() {
	    return (
            <NavigatorIOS
                ref='navigator'
                style={styles.navigator}
                initialRoute={{
		        	component: MyScrollView,
		        	title: 'HOME',
		        	//rightButtonTitle:'right',
					//onRightButtonPress : this._handleNavigator.bind(this, 'right'),
		        	translucent : true,
		        	passProps : { root : this }
		    	}}
            />
	    );
	  }

}

React.AppRegistry.registerComponent('ReactApp', () => App);