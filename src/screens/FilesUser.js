import {Button, StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList} from 'react-native'
import React, {useState, useEffect} from 'react'
import { BASE_URL } from '../config';
import { Header} from '../components';

const FilesUser = ({route}) => {
  const {file_id} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getFiles = async () => {
     try {
      const response = await fetch(`${BASE_URL}/files/user/${file_id}`);
      const json = await response.json();
      setData(json);
      console.log('JSONdata=>',json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  const renderUser = ({item})=>{
    const url = `https://f314-154-72-169-108.eu.ngrok.io${item.fileUpload}`;
    return(
      <View style={styles.item}>
        <Image
        style={styles.image}
        source={{uri:url}}
        resizeMode='contain'
        />
        <View>
            {/* <Text>{`${item.user_firstName} ${item.user_name} ${item.user_phone}`}</Text> */}
            <Text>User_id: {item.user_id}</Text>
            <Text>Email: {item.user_email}</Text>
            <Text>FirstName: {item.user_firstName}</Text>
            <Text>LastName: {item.user_name}</Text>
            <Text>Phone: {item.user_phone}</Text>
            <Text>DateCreated: {item.user_dateCreated}</Text>
            <Text>DateUpdated: {item.user_dateUpdated}</Text>
            <Text>File_id: {item.file_id.toString()}</Text>
            <Text>Name : {item.fileName}</Text>
            <Text>Description: {item.fileDescription}</Text>
            <Text>DateCreated: {item.file_dateCreated.toString()}</Text>
            <Text>DateUpdated: {item.file_dateUpdated.toString()}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header title='All Files User'/>
      <ScrollView>
          {
            isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={data.message}
                keyExtractor={item => item.message?.file_id}
                renderItem={renderUser}
                // contentContainerStyle={{
                //   padding:20
                // }}
              />
            )
          }
          {console.log('Test1=>',data.message)}
        </ScrollView>
      </SafeAreaView>
    </View>
  )}
export default FilesUser

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#102C44',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    shadowColor:'#000',

  },
  item:{
    fontSize:30,
    // backgroundColor:'#fff',
    // shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:10
    },
    shadowOpacity:.3,
    shadowRadius:20,
    padding:15
  },
  image:{
    marginTop:15,
    width: 100,
    height:100,
    borderRadius:20,
    borderWidth:3,
    borderColor:'#4444'
  },
});