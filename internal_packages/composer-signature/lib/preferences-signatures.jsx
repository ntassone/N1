import React from 'react';
import _ from 'underscore';

import {
    Flexbox,
    RetinaImg,
    EditableList,
    Contenteditable,
} from 'nylas-component-kit';
import SignatureActions from './signature-actions';
import SignatureStore from './signature-store'
import {AccountStore} from 'nylas-exports';


export default class PreferencesSignatures extends React.Component {
  static displayName = 'PreferencesSignatures';

    // Signature schema: {id: {id: id, title: title, body: body}}

  constructor() {
    super()
    // const signatures = this._getStateFromStores()
    // this.state = {
    //   signatures: signatures,
    //   selectedSignature: null,
    //   editAsHTML: false,
    //   accounts: AccountStore.accounts(),
    // }

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
    const signatures = SignatureStore._signatures()
    const accounts = AccountStore.accounts()
    const selected = this.state && this.state.selectedSignature ? _.findWhere(signatures, {id: this.state.selectedSignature.id}) : signatures[0];

    return {
      signatures: signatures,
      selectedSignature: selected,
      accounts: accounts,
      editAsHTML: false,
    }
  }


  _renderListItemContent(sig) {
      // return div and add styles
    return sig.title
      // return (<div className="item-rule-disabled">{sig.title}</div>);
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

  _onCreateButtonClick = () => {
    this._onAddSignature()
  }

  _onAddSignature = () => {
    SignatureActions.addSignature()
  }

  _onDeleteSignature = (signature) => {
    SignatureActions.removeSignature(signature)
  }


  _onEditSignatureTitle = (editedTitle, oldSig) => {
    SignatureActions.updateSignatureTitle(editedTitle, oldSig)
  }

  _onEditSignatureBody = (editedSig) => {
    SignatureActions.updateSignatureBody(editedSig.target.value, this.state.selectedSignature)
  }


  _onSelectSignature = (sig) => {
    this.setState({selectedSignature: sig})
  }

  _signaturesToArray() {
    const signatures = this.state.signatures
    const array = []
    console.log("signatures: ", signatures)
    if (signatures) {
      for (const key of Object.keys(signatures)) {
        array.push(signatures[key])
      }
    }
    return array
  }

  _renderAccountPicker() {
    const options = this.state.accounts.map(account =>
      <option value={account.id} key={account.id}>{account.label}</option>
    );

    return (
      <select value={this.state.currentAccountId} style={{minWidth: 200}}>
          {options}
      </select>
    );
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
    const sigArr = this._signaturesToArray()
    console.log("state: ", this.state)
    console.log("sigarr: ", sigArr)
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

  render() {
    return (
      <div className="container-signatures">
        <section>
            {this._renderSignatures()}
        </section>
      </div>
    )
  }
}
