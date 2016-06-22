import {DraftStore, AccountStore, Actions, Utils} from 'nylas-exports';
import SignatureUtils from './signature-utils';
import SignatureActions from './signature-actions';
import NylasStore from 'nylas-store'

const DefaultSignature = "Sent from <a href=\"https://nylas.com/n1?ref=n1\">Nylas N1</a>, the extensible, open source mail client.";

class SignatureStore extends NylasStore {

  activate() {
    this.unsubscribers = [
      SignatureActions.addSignature.listen(this._onAddSignature),
      SignatureActions.removeSignature.listen(this._onRemoveSignature),
      SignatureActions.updateSignatureTitle.listen(this._onEditSignatureTitle),
      SignatureActions.updateSignatureBody.listen(this._onEditSignatureBody),
      SignatureActions.selectSignature.listen(this._onSelectSignature),
      SignatureActions.toggleAccount.listen(this._onToggleAccount),
    ];

    // ** check if already exists before overwritting
    this.signatures = {} || NylasEnv.config.get(`nylas.signatures`) || {}
    this.selectedSignatureId = null
  }

  deactivate() {
    NylasEnv.config.set(`nylas.signatures`, this.signatures)
    this.unsubscribers.forEach(unsub => unsub());
  }

  getSignatures() {
    return this.signatures;
  }

  selectedSignature = () => {
    const sigs = this.getSignatures()
    return sigs[this.selectedSignatureId]
  }

  _onSelectSignature = (id) => {
    this.selectedSignatureId = id
    this.trigger()
  }

  _removeByKey = (obj, keyToDelete) => {
    return Object.keys(obj)
      .filter(key => key !== keyToDelete)
      .reduce((result, current) => {
        result[current] = obj[current];
        return result;
      }, {})
  }

  _onRemoveSignature = (signatureToDelete) => {
    this.signatures = this._removeByKey(this.signatures, signatureToDelete.id)

    this.trigger()
  }

  _onAddSignature = (sigTitle = "Untitled") => {
    const newId = Utils.generateTempId()
    const allAccounts = AccountStore.accounts()
    this.signatures[newId] = {id: newId, title: sigTitle, body: DefaultSignature, defaultFor: {}}
    this.selectedSignatureId = newId
    for (const account of allAccounts) {
      this.signatures[newId].defaultFor[account.id] = false
    }
    this.trigger()
  }

  _onEditSignatureTitle = (editedTitle, oldSig) => {
    this.signatures[oldSig.id].title = editedTitle

    this.trigger()
  }


  _onEditSignatureBody = (editedBody, oldSig) => {
    this.signatures[oldSig.id].body = editedBody

    this.trigger()
  }

  _onToggleAccount = (accountId) => {
    // figure out if toggle on or off - if account already in selectedSignatures list => toggle off, else toggle on
    const toggle = !this.signatures[this.selectedSignatureId].defaultFor[accountId]
    // if toggle this account on, go through all other sigs and toggle this account off
    if (toggle) {
      for (const signatureId of Object.keys(this.signatures)) {
        if (signatureId === this.selectedSignatureId) {
          this.signatures[signatureId].defaultFor[accountId] = true
        } else {
          this.signatures[signatureId].defaultFor[accountId] = false
        }
      }
    } else {
      // if toggle this account off, just go to selectedSignature
      this.signatures[this.selectedSignatureId].defaultFor[accountId] = false
    }

    this.trigger()
  }

}

export default new SignatureStore();
