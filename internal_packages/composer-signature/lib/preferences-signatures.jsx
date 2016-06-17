import React from 'react';
import {
  Flexbox,
  RetinaImg,
  EditableList,
  Contenteditable,
} from 'nylas-component-kit';
import SignatureActions from './signature-actions';

export default class PreferencesSignatures extends React.Component {
  static displayName = 'PreferencesSignatures';

  constructor() {
    super()
    this.state = {
      signatures: [],
      selectedSignature: null,
    }
  }

  _renderListItemContent(sig) {
    // return div and add styles
    return sig.title
    // return (<div className="item-rule-disabled">{sig.title}</div>);
  }

  _onEditSignature = () => {
    // const html = event.target.value;
    // this.setState({currentSignature: html});
    //
    // SignatureActions.setSignatureForAccountId({
    //   accountId: this.state.currentAccountId,
    //   signature: html,
    // });
  }

  _renderEditableSignature() {
    const selected = this.state.selectedSignature ? this.state.selectedSignature.body : ""
    return (
      <div className="signature-wrap">
        <Contenteditable
          ref="signatureInput"
          value={selected}
          spellcheck={false}
          onChange={this._onEditSignature}
        />
      </div>
    )
  }

  _onCreateButtonClick = () => {
    this._onAddSignature()
  }

  _onAddSignature = (sig = "Untitled") => {
    const newSignatures = this.state.signatures.concat([{title: sig, body: 'Add Default'}])
    this.setState({signatures: newSignatures})
  }

  _onDeleteSignature = (signature) => {
    const updatedSignatures = this.state.signatures.filter(sig => sig !== signature)
    this.setState({signatures: updatedSignatures})
  }


  _renderSignatures() {
    if (this.state.signatures.length === 0) {
      return (
        <div className="empty-list">
          <RetinaImg
            className="icon-signature"
            name="signatures-big.png"
            mode={RetinaImg.Mode.ContentDark}
          />
          <h2>No signatures</h2>
          <button className="btn btn-small" onClick={this._onCreateButtonClick}>
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
          items={this.state.signatures}
          itemContent={this._renderListItemContent}
          onCreateItem={this._onAddSignature}
          onDeleteItem={this._onDeleteSignature}
        />
        {this._renderEditableSignature()}
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
