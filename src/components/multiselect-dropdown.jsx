import React, {Component, PropTypes} from 'react';
import {ButtonDropdown, Menu} from 'nylas-component-kit'
import ReactDOM from 'react-dom';

/**
Renders a drop down of items that can have multiple selected
Item can be string or object

@param {object} props - props for MultiselectDropdown
@param {string} props.className - css class applied to the component
@param {array} props.items - items to be rendered in the dropdown
@param {array} props.selectedItems - items to be highlighted in the dropdown
@param {props.onSelectItem} - props.onSelectItem -- add to selectedItems array
@param {props.onExitSelection} - props.onExitSelection -- function called with selectedItems as first parameter
**/

class MultiselectDropdown extends Component {
  static displayName = 'MultiselectDropdown'

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemSelection: PropTypes.object,
    onToggleItem: PropTypes.func,
    selectedItemArr: PropTypes.array,
    itemKeyFunc: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    items: [],
    itemSelection: {},
    onToggleItem: () => {},
  }

  componentDidUpdate() {
    if (ReactDOM.findDOMNode(this.refs.select)) {
      ReactDOM.findDOMNode(this.refs.select).focus()
    }
  }


  _onItemClick = (item) => {
    const accountId = item.id
    this.props.onToggleItem(accountId)
  }

  _renderItem = (item) => {
    const accounts = this.props.itemSelection
    const MenuItem = Menu.Item

    return (
      <MenuItem onMouseDown={() => this._onItemClick(item)} checked={accounts[item.id]} key={item.accountId} content={item.label} />
    )
  }


  _renderMenu= (items, itemKeyFunc) => {
    return (
      <Menu
        items={items}
        itemContent={this._renderItem}
        itemKey={itemKeyFunc}
        onSelect={() => {}}
      />
    )
  }

  render() {
    const {items, itemSelection, itemKeyFunc} = this.props
    const selectedItemArr = []
    for (const accountId of Object.keys(itemSelection)) {
      if (itemSelection[accountId]) selectedItemArr.push(accountId)
    }
    const menu = this._renderMenu(items, itemKeyFunc)
    const buttonText = selectedItemArr.length + (selectedItemArr.length === 1 ? " Account" : " Accounts")
    return (
      <ButtonDropdown
        className={'btn-multiselect'}
        primaryItem={<span>{buttonText}</span>}
        menu={menu}
      />
    )
  }
}
export default MultiselectDropdown
