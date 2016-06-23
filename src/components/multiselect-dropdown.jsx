import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

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

// how should I think about building/testing this?
// where do my styles go?
// want a styled drop down that lets you select multiple options and packages them

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemSelection: PropTypes.object,
    onToggleItem: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    items: [],
    itemSelection: {},
    onToggleItem: () => {},
  }

  // _isHighlighted = () => {
  //
  // }

  _onItemClick = (e) => {
    const accountId = e.target.value
    this.props.onToggleItem(accountId)
  }

  _renderItem = (item) => {
    return (
      <option value={item.id} key={item.accountId} onClick={this._onItemClick}>{item.label}</option>
    )
  }


  render() {
    const {className, items, itemSelection} = this.props
    const forSelectValue = []
    for (const accountId of Object.keys(itemSelection)) {
      if (itemSelection[accountId]) forSelectValue.push(accountId)
    }
    const options = items.map(item => this._renderItem(item))
    return (
      <select multiple className={`nylas-multiselect-dropdown ${className}`} value={forSelectValue} readOnly>
        <option value="number-selected" key="number-selected">{forSelectValue.length} Accounts</option>
        {options}
      </select>
    )
  }
}
export default MultiselectDropdown
