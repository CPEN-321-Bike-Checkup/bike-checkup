import React from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'

let getDate = function (offset) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString();
}

// Note: add separators based on dates
const DATA = [
  {
    title: "Next 10 days",
    data: [
      { bike: "Norco Sasquatch", task: "Oil chain", date: getDate(0) },
      { bike: "Giant Contend AR 1", task: "Oil chain", date: getDate(2) },
      { bike: "Norco Sasquatch", task: "Check brake pads", date: getDate(7) },
    ]
  },
  {
    title: "Next 50 Days",
    data: [
      { bike: "Giant Contend AR 1", task: "Replace chain", date: getDate(13) },
      { bike: "Giant Contend AR 1", task: "Check brake pads", date: getDate(22) },
      { bike: "Norco Sasquatch", task: "Oil chain", date: getDate(27) },
      { bike: "Giant Contend AR 1", task: "Oil chain", date: getDate(30) },
      { bike: "Norco Sasquatch", task: "Bleed brakes", date: getDate(46) },
      { bike: "Giant Contend AR 1", task: "Bleed brakes", date: getDate(50) },
    ]
  }
];

// These don't need to be pressable for now
let Item = ({ item }) => {
  // console.log(title);
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>{item.task}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View>
        <Text style={styles.bike}>{item.bike}</Text>
      </View>
    </View>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props) {
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
    return (
      <View style={styles.container}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item item={item} />} // Item = item in the list (i.e. string)
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    fontSize: 22,
    fontWeight: "500",
    color: "black",
    backgroundColor: "tomato",
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: 2,
    paddingBottom: 4,
    paddingTop: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  date: {
    fontSize: 18,
  },
  bike: {
    fontSize: 16,
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
});