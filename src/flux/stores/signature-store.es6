import {AccountStore, Utils, Actions} from 'nylas-exports';
import NylasStore from 'nylas-store'
import _ from 'underscore'

const DefaultSignature = "Sent from <a href=\"https://nylas.com/n1?ref=n1\">Nylas N1</a>, the extensible, open source mail client.";

class SignatureStore extends NylasStore {

  activate() {
    this.unsubscribers = [
      Actions.addSignature.listen(this._onAddSignature),
      Actions.removeSignature.listen(this._onRemoveSignature),
      Actions.updateSignatureTitle.listen(this._onEditSignatureTitle),
      Actions.updateSignatureBody.listen(this._onEditSignatureBody),
      Actions.selectSignature.listen(this._onSelectSignature),
      Actions.toggleAccount.listen(this._onToggleAccount),
    ];

    NylasEnv.config.onDidChange(`nylas.signatures`, () => {
      this.signatures = NylasEnv.config.get(`nylas.signatures`)
      this.trigger()
    })
    this.signatures = NylasEnv.config.get(`nylas.signatures`) || {}
    this.selectedSignatureId = this._setSelectedSignatureId()
    this.trigger()
  }

  deactivate() {
    this.unsubscribers.forEach(unsub => unsub());
  }

  getSignatures() {
    return this.signatures;
  }

  selectedSignature() {
    return this.signatures[this.selectedSignatureId]
  }

  signatureForAccountId = (accountId) => {
    for (const signatureId of Object.keys(this.signatures)) {
      if (this.signatures[signatureId].defaultFor[accountId] === true) {
        const sig = this.signatures[signatureId]
        return sig.body !== "" ? sig : null
      }
    }
    return null
  }

  objectToArray = (obj) => {
    const array = []
    if (obj) {
      for (const key of Object.keys(obj)) {
        array.push(obj[key])
      }
    }
    return array
  }

  _save() {
    _.debounce(NylasEnv.config.set(`nylas.signatures`, this.signatures), 500)
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

  _setSelectedSignatureId() {
    const sigIds = Object.keys(this.signatures)
    if (sigIds.length) {
      return sigIds[0]
    }
    return null
  }

  _onRemoveSignature = (signatureToDelete) => {
    this.signatures = this._removeByKey(this.signatures, signatureToDelete.id)
    this.selectedSignatureId = this._setSelectedSignatureId()
    this.trigger()
    this._save()
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
    this._save()
  }

  _onEditSignatureTitle = (editedTitle, oldSig) => {
    this.signatures[oldSig.id].title = editedTitle
    this.trigger()
    this._save()
  }


  _onEditSignatureBody = (editedBody, oldSig) => {
    this.signatures[oldSig.id].body = editedBody
    this.trigger()
    this._save()
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
    this._save()
  }

}

export default new SignatureStore();
