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
    ];

    // ** check if already exists before overwritting
    this.signatureList = {} || NylasEnv.config.get(`nylas.signatures`) || {}
    this.selectedSignatureId = null
  }

  deactivate() {
    NylasEnv.config.set(`nylas.signatures`, this.signatureList)
    this.unsubscribers.forEach(unsub => unsub());
  }

  signatures() {
    return this.signatureList;
  }

  selectedSignature = () => {
    const sigs = this.signatures()
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
    this.signatureList = this._removeByKey(this.signatureList, signatureToDelete.id)

    this.trigger()
  }

  // create method to query signatures - all signatures
  // when this calls trigger() -- onSignaturesChange willeb called

  _onAddSignature = (sigTitle = "Untitled") => {
    const newId = Utils.generateTempId()
    this.signatureList[newId] = {id: newId, title: sigTitle, body: DefaultSignature}
    this.selectedSignatureId = newId
    this.trigger()
  }

  _onEditSignatureTitle = (editedTitle, oldSig) => {
    this.signatureList[oldSig.id].title = editedTitle

    this.trigger()
  }


  _onEditSignatureBody = (editedBody, oldSig) => {
    this.signatureList[oldSig.id].body = editedBody

    this.trigger()
  }

}

export default new SignatureStore();
