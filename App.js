import React, { useState } from 'react';
import {Text, View, StyleSheet, Image, Button, Alert, TouchableOpacity, Platform} from 'react-native';
import diamondImage from './assets/diamond.jpg';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFiles from 'anonymous-files';

const App = ()=>{

  function handlePress(params) {
    console.log("Hola mundo")
  }

  const [selectedImage, setselectedImage] = useState(null)

  let openImagePickerAsyn = async ()=>{
    let permissionResult =  await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("clicked")
    if(permissionResult.granted===false){
      alert("Permission to access camera is required")
      return;
    }
    let pickerResult =await ImagePicker.launchImageLibraryAsync()
    if(pickerResult.cancelled===true){
      return;
    }

    if(Platform.OS==="web"){
      const remoteUri = await uploadToAnonymousFiles(pickerResult.uri)
      setselectedImage({localUri: pickerResult.uri, remoteUri})
    }else{
    setselectedImage({localUri: pickerResult.uri})
    }
  }

  const openShareDialog = async ()=>{
   if((!await Sharing.isAvailableAsync())){
     alert(`The image is available for sharing at: ${selectedImage.remoteUri}`)
     return
   }
   await Sharing.shareAsync(selectedImage.localUri);
  }

  return <View style={styles.container}>

      <Text style={styles.title}>
        Hello Oscar!
      </Text>
      <TouchableOpacity   onPress={()=>openImagePickerAsyn()}>
      <Image source={{uri: selectedImage!==null ? selectedImage.localUri :  "https://pbs.twimg.com/profile_images/1296188634404737031/RUJOD0mL_400x400.jpg"}} 
      style={styles.imagen} 
    />
      </TouchableOpacity>
      {selectedImage ? <TouchableOpacity  style={styles.button} onPress={()=>openShareDialog()}>
        <Text style={styles.buttonText}>Share this image</Text>
      </TouchableOpacity> : <View/>}
      
  </View>
}

const styles = StyleSheet.create({
  container:{backgroundColor: "#292929", flex: 1, justifyContent: "center", alignItems: "center"},
  title:{fontSize: 30, color:"#fff"},
  imagen: {height: 200, width:200, borderRadius: 100, resizeMode:'contain'},
  button:{
    backgroundColor:"red",
    padding: 7,
    marginTop: 10
  },
  buttonText:{
    color: "#fff",
    fontSize:20
  }
})
export default App