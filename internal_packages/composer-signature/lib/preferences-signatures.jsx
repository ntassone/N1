import React from 'react';

import {
    Flexbox,
    RetinaImg,
    EditableList,
    Contenteditable,
    MultiselectDropdown,
} from 'nylas-component-kit';
import {AccountStore, SignatureStore, Actions} from 'nylas-exports';


export default class PreferencesSignatures extends React.Component {
  static displayName = 'PreferencesSignatures';

    // Signature schema: {id: {id: id, title: title, body: body, defaultFor: {}}}
    // Default For schema: {id: true, id: false}

  constructor() {
    super()
    this.state = this._getStateFromStores()
  }

  componentDidMount() {
    this.unsubscribers = [
      SignatureStore.listen(this._onChange),
    ]
  }

  componentWillUnmount() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
  }


  _onChange = () => {
    this.setState(this._getStateFromStores())
  }

  _getStateFromStores() {
    const signatures = SignatureStore.getSignatures()
    const accounts = AccountStore.accounts()
    const selected = SignatureStore.selectedSignature()

    return {
      signatures: signatures,
      selectedSignature: selected,
      accounts: accounts,
      editAsHTML: false,
    }
  }


  _onCreateButtonClick = () => {
    this._onAddSignature()
  }

  _onAddSignature = () => {
    Actions.addSignature()
  }

  _onDeleteSignature = (signature) => {
    Actions.removeSignature(signature)
  }


  _onEditSignatureTitle = (editedTitle, oldSig) => {
    Actions.updateSignatureTitle(editedTitle, oldSig)
  }

  _onEditSignatureBody = (e) => {
    Actions.updateSignatureBody(e.target.value, this.state.selectedSignature)
  }

  _onSelectSignature = (sig) => {
    Actions.selectSignature(sig.id)
  }

  _onToggleAccount = (accountId) => {
    Actions.toggleAccount(accountId)
  }

  _renderListItemContent(sig) {
    return sig.title
  }

  _renderSignatureToolbar() {
    const action = () => {
      const toggle = !this.state.editAsHTML
      this.setState({editAsHTML: toggle})
    };
    return (
      <div className="editable-toolbar">
        <div className="account-picker">
          Default for: {this._renderAccountPicker()}
        </div>
        <div className="render-mode">
          <input type="checkbox" id="render-mode" checked={this.state.editAsHTML} onClick={action} />
          <label>Edit raw HTML</label>
        </div>
      </div>
    )
  }

  _renderAccountPicker() {
    return (
      <MultiselectDropdown
        className="account-dropdown"
        items={this.state.accounts}
        itemSelection={this.state.selectedSignature.defaultFor}
        onToggleItem={this._onToggleAccount}
      />
    )
  }

  _renderEditableSignature() {
    const selectedBody = this.state.selectedSignature ? this.state.selectedSignature.body : ""
    return (
      <Contenteditable
        ref="signatureInput"
        value={selectedBody}
        spellcheck={false}
        onChange={this._onEditSignatureBody}
      />
    )
  }

  _renderHTMLSignature() {
    return (
      <textarea
        value={this.state.selectedSignature.body}
        onChange={this._onEditSignatureBody}
      />
    );
  }

  _renderSignatures() {
    const sigArr = SignatureStore.signaturesToArray()
    if (sigArr.length === 0) {
      return (
        <div className="empty-list">
          <RetinaImg
            className="icon-signature"
            name="signatures-big.png"
            mode={RetinaImg.Mode.ContentDark}
          />
          <h2>No signatures</h2>
          <button className="btn btn-small" onMouseDown={this._onCreateButtonClick}>
              Create a new signature
          </button>
        </div>
      );
    }
    return (
      <Flexbox>
        <EditableList
          showEditIcon
          className="signature-list"
          items={sigArr}
          itemContent={this._renderListItemContent}
          onCreateItem={this._onAddSignature}
          onDeleteItem={this._onDeleteSignature}
          onItemEdited={this._onEditSignatureTitle}
          onSelectItem={this._onSelectSignature}
          selected={this.state.selectedSignature}
        />
        <div className="signature-wrap">
            {this.state.editAsHTML ? this._renderHTMLSignature() : this._renderEditableSignature()}
            {this._renderSignatureToolbar()}
        </div>
      </Flexbox>
    )
  }

  _renderSignatureTree() {
    const sigJSON = SignatureStore.signaturesToArray().map(sig =>
      <div key={sig.id}>
        <pre>
          {JSON.stringify(sig, null, 2)}
        </pre>
      </div>
    )

    return (
      <section>{sigJSON}</section>
    )
  }

  render() {
    return (
      <div className="container-signatures">
        <section>
          {this._renderSignatures()}
        </section>
        {this._renderSignatureTree()}
      </div>
    )
  }
}
