import React, {Component, PropTypes} from 'react';
import {ButtonDropdown, Menu} from 'nylas-component-kit'
import ReactDOM from 'react-dom';
import _ from 'underscore'

/**
Renders a drop down of items that can have multiple selected
Item can be string or object

@param {object} props - props for MultiselectDropdown
@param {string} props.className - css class applied to the component
@param {array} props.items - items to be rendered in the dropdown
@param {props.onSelectItem} - props.itemSelection -- an object containing the boolean selection status for each item
@param {props.onToggleSelection} - props.onToggleSelection -- function called when an item is clicked
@param {props.itemKeySelection} - props.itemKeySelection -- function that indicates how to select the key for each MenuItem
**/

class MultiselectDropdown extends Component {
  static displayName = 'MultiselectDropdown'

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemSelection: PropTypes.object,
    onToggleItem: PropTypes.func,
    itemKeySelection: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    items: [],
    itemSelection: {},
    onToggleItem: () => {},
    itemKeySelection: () => {},
  }

  componentDidUpdate() {
    if (ReactDOM.findDOMNode(this.refs.select)) {
      ReactDOM.findDOMNode(this.refs.select).focus()
    }
  }


  _onItemClick = (item) => {
    this.props.onToggleItem(item.id)
  }

  _renderItem = (item) => {
    const items = this.props.itemSelection
    const MenuItem = Menu.Item
    return (
      <MenuItem onMouseDown={() => this._onItemClick(item)} checked={items[item.id]} key={this.props.itemKeySelection(item)} content={item.label} />
    )
  }


  _renderMenu= (items) => {
    return (
      <Menu
        items={items}
        itemContent={this._renderItem}
        itemKey={item => item.id}
        onSelect={() => {}}
      />
    )
  }

  render() {
    const {items, itemSelection} = this.props
    const numSelected = _.values(_.pick(itemSelection, (val) => { return val === true })).length
    const menu = this._renderMenu(items)
    const buttonText = numSelected.toString() + (numSelected === 1 ? " Account" : " Accounts")
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
