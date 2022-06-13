import React from 'react'
import { View } from 'react-native'

export const RadioButton = ({ color = '#FFF', selected = false, style = {} }) => {
  return (
    <View
      style={[
        {
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: selected ? 1 : 0,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center'
        },
        style
      ]}
    >
      <View
        style={{
          height: 30,
          width: 30,
          borderRadius: 15,
          backgroundColor: color
        }}
      />
    </View>
  )
}
