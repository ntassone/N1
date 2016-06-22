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
    selectedItems: PropTypes.array,
    onToggleItem: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    items: [],
    selectedItems: [],
    onToggleItem: () => {},
  }

  _onItemClick = (e) => {
    const accountId = e.target.value
    this.props.onToggleItem(accountId)
  }


  render() {
    const {className, items} = this.props

    const options = items.map(item =>
      <option value={item.id} key={item.accountId} onClick={this._onItemClick}>{item.label}</option>
    )
    return (
      <select multiple className={className} >
        {options}
      </select>
    )
  }
}
export default MultiselectDropdown
