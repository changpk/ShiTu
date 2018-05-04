/**
 * @flow
 * Created by Rabbit on 2018/5/4.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';

import {System} from "../../../utils";
import {Fetch, MasonryList} from "../../../components";
import type {RTGankResult, RTWeal} from "../../../servers/News/types";
import {loadWealPictureData} from "../../../servers/News";

let loadMoreNumber = []

type Props = {};
type State = {
  isRefreshing: boolean,
  dataSource: Array<any>,
  results:  Array<any>,
  imageData:  Array<any>,
  page: number,
}
export default class index extends React.Component<Props, State> {

  state = {
    isRefreshing: true,
    dataSource: [],
    results: [],
    imageData: [],
    page: 1,
  };

  async componentDidMount() {
    await this.fetchData(this.state.page)
  }

  fetchData = async (page: number) => {

    try {
      let data = await loadWealPictureData(page)

      let results = data.results

      results.map((item: RTWeal) => {
        let imageWidth = System.SCREEN_WIDTH / 2 - 15;
        let imageHeight = imageWidth * 1.15;
        imageHeight = parseInt(Math.random() * 100 + imageHeight);
        item.height = imageHeight;
        item.width = imageWidth;
      });

      setTimeout(()=> {
        if (page !== 1) {
          console.log('page不等于1', page);
          this.setState({
            page: page,
            dataSource : this.state.dataSource.concat(results),
            isRefreshing:false,
          });
        } else {
          this.setState({
            page: 1,
            dataSource: results,
            isRefreshing: false
          });
          console.log('page等于1', page);
        }
      },500);
    } catch (e) {
    }
  }

  loadMoreData = (distanceFromEnd: number) => {

    if (loadMoreNumber.length === 2) loadMoreNumber = [];

    loadMoreNumber.push(distanceFromEnd);

    let page = this.state.page;

    if (loadMoreNumber.length === 2){
      page += 1;
      this.fetchData(page)
    }

  }
  _refreshRequest = () => {
    this.setState({ isRefreshing: true });
    this.fetchData(1)
  };

  renderItem = ({ item, index, column }: any) => {
    const _item: RTWeal = item;
    return(
      <Image source={{uri: _item.url}}
             style={[
               styles.cell,
               { height: item.height, backgroundColor: 'white'},
             ]}
      />
    )
  }

  render() {
    return (
      <MasonryList
        onRefresh={this._refreshRequest}
        refreshing={this.state.isRefreshing}
        data={this.state.dataSource}
        renderItem={this.renderItem}
        getHeightForItem={({ item }) => item.height + 2}
        numColumns={2}
        keyExtractor={item => item._id}
        // ListEmptyComponent={()=> <Text>222222</Text>}
        ListHeaderComponent={()=><View/>}
        // ListFooterComponent={()=>
        //   <View style={{height: 50, flex:1,  alignItems: 'center', justifyContent: 'center'}}>
        //     <ActivityIndicator size={'small'}/>
        //   </View>
        // }
        onEndReachedThreshold={0.1}
        onEndReached={this.loadMoreData}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cell: {
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});