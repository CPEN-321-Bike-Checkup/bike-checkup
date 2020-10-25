import React from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'

// Note: add separators based on dates
const DATA = [
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"]
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"]
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"]
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"]
  }
];

// These don't need to be pressable for now
let Item = ({ title }) => {
  // console.log(title);
  return (
  <Pressable style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </Pressable>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        maintenanceData: []
    };
  }

  updateMaintenanceData() {
    // this.setState({maintenanceData: })
  }

  componentDidMount() {
    // fetch('3.97.53.16:8080/maintenance-schedule/', {
    //   method: 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     this.updateMaintenanceData({dateJSON: data})
    //   })
    //   .catch((error) => {
    //     // this.setState({dateJSON: "Error fetching data"})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;
  }
  
  render() {
    return(
        <View style={styles.container}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />} // Item = item in the list (i.e. string)
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    padding: 18,
  },
  header: {
    fontSize: 25,
    fontWeight: "500",
    backgroundColor: "tomato",
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: 2,
  },
  title: {
    fontSize: 20
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
});