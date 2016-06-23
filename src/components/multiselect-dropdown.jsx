import React, {Component, PropTypes} from 'react';
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

  constructor() {
    super()
    this.state = {
      selectingItems: false,
    }
  }

  componentDidUpdate() {
    if (ReactDOM.findDOMNode(this.refs.select)) {
      ReactDOM.findDOMNode(this.refs.select).focus()
    }
  }


  _onItemClick = (e) => {
    const accountId = e.target.value
    this.props.onToggleItem(accountId)
  }

  _renderItem = (item) => {
    return (
      <option value={item.id} key={item.accountId} onClick={this._onItemClick}>{item.label}</option>
    )
  }

  _onExpandDropdown = () => {
    this.setState({selectingItems: true})
  }

  _onCollapseDropdown = () => {
    this.setState({selectingItems: false})
  }

  _renderCollapsed = (numSelected) => {
    return (
      <button value="number-selected" key="number-selected" onClick={this._onExpandDropdown}>{numSelected} Accounts</button>
    )
  }

  _renderExpanded = (items, selectedItemArr, className) => {
    const options = items.map(item => this._renderItem(item))
    return (
      <select multiple className={`nylas-multiselect-dropdown ${className}`} ref="select" value={selectedItemArr} onBlur={this._onCollapseDropdown} readOnly>
        {options}
      </select>
    )
  }

  render() {
    const {className, items, itemSelection} = this.props
    const selectedItemArr = []
    for (const accountId of Object.keys(itemSelection)) {
      if (itemSelection[accountId]) selectedItemArr.push(accountId)
    }
    if (this.state.selectingItems) {
      return (
        this._renderExpanded(items, selectedItemArr, className)
      )
    }
    return (
      this._renderCollapsed(selectedItemArr.length)
    )
  }
}
export default MultiselectDropdown
