import React from 'react';
import { Text, TouchableOpacity } from 'react-native'
import { EditableListItem } from "../ListItems";
import { selectionListWrapper } from "../SectionListWrapper";
import CommonStyles from "../CommonStyles";


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
      //   title: "Next 10 days",
      //   data: [
      //   ]
      // },
      {
        title: "Next 50 Days",
        data: [
          { task: "Bleed brakes", date: getDate(50) },
        ]
      }
    ]
  },
  {
    id: 2,
    componentData: [
      {
        title: "Next 10 days",
        data: [
          { task: "Oil chain", date: getDate(2) },
        ]
      },
      {
        title: "Next 50 Days",
        data: [
          { task: "Replace chain", date: getDate(13) },
          { task: "Oil chain", date: getDate(30) },
        ]
      }
    ]
  },
  {
    id: 3,
    componentData: [
      // {
      //   title: "Next 10 days",
      //   data: [
      //   ]
      // },
      {
        title: "Next 50 Days",
        data: [
          { task: "Check brake pads", date: getDate(22) },
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
      //   title: "Next 10 days",
      //   data: [
      //   ]
      // },
      {
        title: "Next 50 Days",
        data: [
          { task: "Bleed brakes", date: getDate(50) },
        ]
      }
    ]
  },
  {
    id: 2,
    componentData: [
      {
        title: "Next 10 days",
        data: [
          { task: "Oil chain", date: getDate(0) },
        ]
      },
      {
        title: "Next 50 Days",
        data: [
          { task: "Oil chain", date: getDate(27) },
        ]
      }
    ]
  },
  {
    id: 3,
    componentData: [
      {
        title: "Next 10 days",
        data: [
          { task: "Check brake pads", date: getDate(7) },
        ]
      },
      // {
      //   title: "Next 50 Days",
      //   data: [
      //   ]
      // }
    ]
  }
];


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
    //     // this.setState({dateJSON: "Error fetching data"})
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
          <Text style={CommonStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });

    let data = this.bikeId == 1 ? NORCO_DATA[this.componentId - 1].componentData : GIANT_DATA[this.componentId - 1].componentData;
    return selectionListWrapper(data, ({ item }) => <EditableListItem item={item} editMode={this.state.editMode} />);
  }
}
