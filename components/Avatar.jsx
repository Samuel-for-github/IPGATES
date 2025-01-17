import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect} from 'react'
import {getImage} from '../services/imageService.js'
import { Image } from 'react-native'
const Avatar = ({uri, size, rounded, style}) => {
  
  return (
    
      <Image source={getImage(uri)} style={[{height: size, width: size, borderRadius: rounded}, style]} />
    
  )
}

export default Avatar

const styles = StyleSheet.create({})