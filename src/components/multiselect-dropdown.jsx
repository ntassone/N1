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

  _onBoxClick() {
    this.props.onToggleItem
  }

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onToggleItem: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    items: [],
    selectedItems: [],
  }


  _renderOption = (item, onAccountClick, selectedSig) => {
    let classes = ""
    if (selectedSig) {
      classes = classNames({
        selected: selectedSig.accounts.indexOf(item.accountId) > -1,
      })
    }
    console.log("ssi: ", selectedSig)
    return (
      <option value={item.id} className={classes} onClick={onAccountClick} key={item.accountId}>{item.label}</option>
    )
  }

  render() {
    const {className, items, selected, onAccountClick, selectedSig} = this.props

    return (
      <select multiple defaultValue={[selected]} className={className} >
        {items.map((item) => this._renderOption(item, onAccountClick, selectedSig))}
      </select>
    )
  }
}
export default MultiselectDropdown
