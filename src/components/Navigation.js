import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, LoginScreen, RegisterScreen, AddFile, ListUsers, SplashScreen, EditFile, FilesUser } from '../screens';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

function Navigation() {
  const {userInfo, splashLoading} = useContext(AuthContext);

  return (
    <NavigationContainer>
        <Stack.Navigator>
          {splashLoading ? (
            <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{headerShown:false}}
            />
          ):
          userInfo.token ? (<>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name='Users' component={ListUsers}/>
            <Stack.Screen name='AddFile' component={AddFile}/>
            <Stack.Screen name='EditFile' component={EditFile}/>
            <Stack.Screen name='FilesUser' component={FilesUser}/>
            </>
          ):(<>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
            </>
          )}
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;