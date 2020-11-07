import React from 'react';
import { SectionList, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


let getDate = function (offset) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString();
}

// Note: add separators based on dates
const GIANT_DATA = [
  {
    id: 1,
    componentData: [
      // {
      //   title: 'Next 10 days',
      //   data: [
      //   ]
      // },
      {
        title: 'Next 50 Days',
        data: [
          { task: 'Bleed brakes', date: getDate(50) },
        ]
      }
    ]
  },
  {
    id: 2,
    componentData: [
      {
        title: 'Next 10 days',
        data: [
          { task: 'Oil chain', date: getDate(2) },
        ]
      },
      {
        title: 'Next 50 Days',
        data: [
          { task: 'Replace chain', date: getDate(13) },
          { task: 'Oil chain', date: getDate(30) },
        ]
      }
    ]
  },
  {
    id: 3,
    componentData: [
      // {
      //   title: 'Next 10 days',
      //   data: [
      //   ]
      // },
      {
        title: 'Next 50 Days',
        data: [
          { task: 'Check brake pads', date: getDate(22) },
        ]
      }
    ]
  }
];


const NORCO_DATA = [
  {
    id: 1,
    componentData: [
      // {
      //   title: 'Next 10 days',
      //   data: [
      //   ]
      // },
      {
        title: 'Next 50 Days',
        data: [
          { task: 'Bleed brakes', date: getDate(50) },
        ]
      }
    ]
  },
  {
    id: 2,
    componentData: [
      {
        title: 'Next 10 days',
        data: [
          { task: 'Oil chain', date: getDate(0) },
        ]
      },
      {
        title: 'Next 50 Days',
        data: [
          { task: 'Oil chain', date: getDate(27) },
        ]
      }
    ]
  },
  {
    id: 3,
    componentData: [
      {
        title: 'Next 10 days',
        data: [
          { task: 'Check brake pads', date: getDate(7) },
        ]
      },
      // {
      //   title: 'Next 50 Days',
      //   data: [
      //   ]
      // }
    ]
  }
];

// These don't need to be pressable for now
let Item = ({ item, editMode }) => {
  console.log('Item editMode:')
  console.log(editMode);
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {editMode ? <TouchableOpacity><MaterialIcons name='remove-circle' color={'red'} size={24} /></TouchableOpacity> : null}
        <Text style={styles.title}>{item.task}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceData: [],
      editMode: false
    };
    this.navigation = props.navigation;
    this.bikeId = props.route.params.bikeId;
    this.componentId = props.route.params.componentId;
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
    //     // this.setState({dateJSON: 'Error fetching data'})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    this.setState({ editMode: this.state.editMode ? false : true });
  }

  render() {
    // Add edit button to navigation bar
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode} >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });

    console.log(this.componentId)
    console.log(NORCO_DATA[this.componentId - 1].componentData)

    return (
      <View style={styles.container}>
        <SectionList
          sections={this.bikeId === 1 ? NORCO_DATA[this.componentId - 1].componentData : GIANT_DATA[this.componentId - 1].componentData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item item={item} editMode={this.state.editMode} />} // Item = item in the list (i.e. string)
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
    backgroundColor: 'white',
    padding: 18,
  },
  header: {
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
    backgroundColor: 'tomato',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: 2,
    paddingBottom: 4,
    paddingTop: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
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
  editButtonText: {
    fontSize: 15,
    color: 'white',
    padding: 10,
    fontWeight: 'bold'
  }
});