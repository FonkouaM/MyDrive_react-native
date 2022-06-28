import React, {useContext, useState, useEffect} from 'react';
import {ActivityIndicator, Button, Alert, StyleSheet, Text,
   Image, TouchableOpacity, View, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
// import { Document, Page } from 'react-pdf';
import * as OpenAnything from 'react-native-openanything';
import { BASE_URL } from '../config';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({navigation}) => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  

  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  //   // setPageNumber()
  // }

  const getFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/files/user`,{
        headers: {'Authorization': `${userInfo.token}`}
      });
      console.log('IDENTITY_USER:',`${userInfo.token}`);
      console.log('JSONdata=>',data);
      const json = await response.json();
      setData(json); 
      // Alert.alert("NB:",json.message);
      console.log('JSONdata1=>',json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(3000).then(() => setRefreshing(false)); 
    getFiles();
  }, []);

  async function deleteFile(file_id) {
    console.log('FileItemID:',file_id)
    setLoading(true);
    
    await fetch(`${BASE_URL}/file/del/${file_id}`, {
      method: 'DELETE',
      headers:{
        'Authorization': `${userInfo.token}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data;',
      },
    }).then((res) => res.json())
    .then(response =>{
      setLoading(false);
      console.log(response);
      getFiles();
      Alert.alert("Okay!",response.message);
    })
    .catch((error)=>{
      console.log('Error: ', error);
      setLoading(false);
    });
  }

  const showConfirmDialog = (fileItem) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this file ?",
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deleteFile(fileItem);
            console.log(fileItem)
          },
        },
      ]
      );
  };

  const renderUser = ({item})=>{
    
    const url = `https://bf53-154-72-171-87.eu.ngrok.io${item.fileUpload}`;
    return(
      <View  key={item.file_id}  style={styles.item}>
        <Image
        style={styles.image}
        source={{uri: url}}
        resizeMode='contain'
        />
        {/* <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
        </Document>
        <Text>
          Page {pageNumber} of {numPages}
        </Text> */}
        <View>
          {/* <Text>{`${item.user_firstName} ${item.user_name} ${item.user_phone}`}</Text> */}
          <Text>File_id: {item.file_id}</Text>
          <Text>Name : {item.fileName}</Text>
          <Text>Description: {item.fileDescription}</Text>
          <Text>DateCreated: {item.file_dateCreated}</Text>
          <Text>DateUpdated: {item.file_dateUpdated}</Text>
          <Text>User_id: {item.user.userId}</Text>
          <Text>Email: {item.user.userEmail}</Text>
          <Text>FirstName: {item.user.userFirstName}</Text>
          <Text>LastName: {item.user.userName}</Text>
          <Text>Phone: {item.user.userPhone}</Text>
        </View>
        <View  style={styles.iconImag}>
          <TouchableOpacity style={styles.iconEdit}
            onPress={()=>navigation.navigate('EditFile',{file_id: item.file_id,fileName: item.fileName,
            fileDescription: item.fileDescription, fileUpload:item.fileUpload})}
          >
            <Image style={styles.imgIcon} source={require('../assets/icons/edit.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconDel}
              onPress={()=>showConfirmDialog( item.file_id,console.log(item.file_id))}
          > 
            <Image style={styles.imgIcon} source={require('../assets/icons/delete.png')}/>
          </TouchableOpacity>
        </View>
          <Button
            title='Open File'
            onPress={()=>OpenAnything.Pdf({uri:url})}
          />
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <SafeAreaView>
        
        <TouchableOpacity
        style={styles.btnTop} 
        onPress={()=>navigation.navigate('Users')}>
          <Text style={styles.btnText}>Users</Text>
        </TouchableOpacity>
        <View style={styles.listFiles}>
          <Text style={styles.welcome}>Welcome to MyDrive {userInfo.userName} !!!</Text>
     
          {
            loading ? <ActivityIndicator/> : (
              <FlatList
                data={data.message}
                keyExtractor={item => `${item.file_id}`}
                renderItem={renderUser}
                refreshControl={
                  <RefreshControl
                  colors={["#9Bd35A", "#689F38"]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                />
                
                )
              }
              {/* {console.log(data.message)} */}
              {console.log('messageData',data.message)}
        
          {/* {console.log('Test1=>',data.message?.fileUpload)} */}
        </View>
     
          <View style={styles.btnBottom}>
            <TouchableOpacity
            style={styles.btnLogout}
            onPress={logout}
            >
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.btnAdd}
            onPress={()=>navigation.navigate("AddFile")}
            >
              <Text style={styles.textBtn}>+</Text>
            </TouchableOpacity>
          </View>
       
      </SafeAreaView>
    </View>
  )};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#102C44',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 18,
    fontWeight:'800',
    marginBottom: 8,
    color: 'green',
    margin: 10
  },
  btnTop:{
    top:'23%',
    left:'65%',
    width:'25%',
    // padding:30,
    paddingBottom:20,
    paddingTop:20,
    alignSelf:'center',
    backgroundColor:'blue',
    justifyContent:'center',
    borderRadius:10,
    position:'absolute',
  },
  btnBottom:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    height:'75%',
    top:'60%',
    marginLeft:40
  },
  btnAdd:{
    position:'absolute',
    backgroundColor:'blue',
    borderRadius:30,
    width:45,
    height:45,
    left:'80%',
    bottom:'158%'
  },
  textBtn:{
    alignSelf:'center',
    justifyContent:'center',
    fontSize:30,
    fontWeight:'bold',
    position:'absolute',
  },
  btnText:{
    alignSelf:'center',
    // alignItems:'center',
    justifyContent:'center',
    fontSize:15,
    fontWeight:'bold',
    position:'absolute'
  },
  btnLogout:{
    position:'absolute',
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor: 'red',
    borderRadius:10,
    color:'#fff',
    paddingBottom:20,
    paddingTop:20,
    paddingLeft:30,
    paddingRight:30,
    right:'90%',
    bottom:'158%'
  },
  listFiles:{
    // height:'70%',
    paddingVertical:'80%'
  },
  image:{
    marginTop:10,
    alignSelf:'center',
    width: '90%',
    height:170,
    borderRadius:20,
    borderWidth:3,
    borderColor:'#4444'
  },
  item:{
    fontSize:30,
    fontWeight:'700',
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
  iconImag:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignSelf:'center',
    padding:20,
    borderRadius:20
  },
  iconEdit:{
    backgroundColor:'blue',
    justifyContent:'center',
    width:50,
    height:50,
    marginRight:'30%',
    borderRadius:20
  },
  iconDel:{
    backgroundColor:'red',
    justifyContent:'center',
    width:50,
    height:50,
    marginLeft:'30%',
    borderRadius:50
  },
  imgIcon:{
    alignSelf:'center',
    width:30,
    height:30
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    marginBottom: 30,
  },
  text: {
    fontSize: 30,
  },
});