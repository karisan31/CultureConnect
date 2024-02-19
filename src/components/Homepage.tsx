import { StyleSheet, Text, View, Image, Button } from "react-native";
import Colors from "../constants/Colors";
import EventsList from "./EventsList";



export default function Homepage(){
    return(
        <View>
            <Text> CultureConnect </Text>
            <Button title='List'></Button>
            <Button title='Map'></Button>
            <EventsList/>
        </View>
    )
}