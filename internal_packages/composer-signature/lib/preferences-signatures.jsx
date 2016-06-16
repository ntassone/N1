import React from 'react';
// import {Contenteditable,
//         Flexbox,
//         EditableList} from 'nylas-component-kit';
import {Flexbox,
        RetinaImg} from 'nylas-component-kit';
import {AccountStore} from 'nylas-exports';
// import SignatureStore from './signature-store';
// import SignatureActions from './signature-actions';

const signatures = [
//   {
//   title: 'my sig',
//   body: 'something',
// }
]

export default class PreferencesSignatures extends React.Component {
  static displayName = 'PreferencesSignatures';

  constructor() {
    super()
    this.state = this._getStateFromStores()
  }

  _getStateFromStores() {
    const accounts = AccountStore.accounts()
    const state = this.state || {}
    let {currentAccount} = state
    if (!accounts.find(acct => acct === currentAccount)) {
      currentAccount = accounts[0];
    }
    // const signatures = SignatureStore
    return {
      accounts: accounts,
      currentAccount: currentAccount,
      signatures: signatures,
    }
  }

  // _onAddSignature(){}
  // _renderListItemContent(){}

  _renderAccountPicker() {
    console.log("STATE: ", this.state.currentAccount)
    const options = this.state.accounts.map(account =>
      <option value={account.accountId} key={account.accountId}>{account.label}</option>
    );

    return (
      <select
        value={this.state.currentAccount.accountId}
        style={{margin: 0, minWidth: 200}}
      >
        {options}
      </select>
    );
  }

  _renderSignatures() {
    // if (this.state.signatures.length === 0) {
    return (
      <div className="empty-list">
        <RetinaImg
          className="icon-signature"
          name="rules-big.png"
          mode={RetinaImg.Mode.ContentDark}
        />
        <h2>No signatures</h2>
        <button className="btn btn-small">
          Create a new signature
        </button>
      </div>
    );
    // }
    // return (
    //   <Flexbox>
    //     <EditableList
    //       showEditIcon
    //       className="signature-list"
    //       items={this.state.signatures}
    //       itemContent={this._renderListItemContent}
    //     />
    //   </Flexbox>
    // )
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
