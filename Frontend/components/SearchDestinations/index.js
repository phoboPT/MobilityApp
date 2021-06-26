import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const items = [
  {
    id: '92iijs7yta',
    name: 'Ondo',
  },
  {
    id: 'a0s0a8ssbsd',
    name: 'Ogun',
  },
  {
    id: '16hbajsabsd',
    name: 'Calabar',
  },
  {
    id: 'nahs75a5sg',
    name: 'Lagos',
  },
  {
    id: '667atsas',
    name: 'Maiduguri',
  },
  {
    id: 'hsyasajs',
    name: 'Anambra',
  },
  {
    id: 'djsjudksjd',
    name: 'Benue',
  },
  {
    id: 'sdhyaysdj',
    name: 'Kaduna',
  },
  {
    id: 'suudydjsjd',
    name: 'Abuja',
  },
];

export default class SearchDestinations extends Component {
  state = {
    selectedItems: [],
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems}, () =>
      console.warn('Selected Items: ', selectedItems),
    );
  };

  render() {
    const {selectedItems} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.multiSelectContainer}>
          <MultiSelect
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Pick Items"
            textColor="black"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.warn(text)}
            tagRemoveIconColor="#000"
            tagBorderColor="#000"
            tagTextColor="#000"
            selectedItemTextColor="#000"
            selectedItemIconColor="#000"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#000'}}
            submitButtonColor="#000"
            submitButtonText="Submit"
            removeSelected
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  multiSelectContainer: {
    height: 400,
    width: '80%',
  },
});
