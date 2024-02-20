import { StyleSheet, Text, View, Image, Button, useColorScheme} from "react-native";
import Colors from "../constants/Colors";
import EventsList from "./EventsList";





export default function Homepage(){

const theme = useColorScheme();

const textColor = [
    theme === 'dark' ? {color:Colors.dark.text} : {color:Colors.light.text}
  ]

    return(
        <View>
            <Text style={textColor} > CultureConnect </Text>
            <Button title='List'></Button>
            <Button title='Map'></Button>
            <EventsList />
        </View>
    )
}