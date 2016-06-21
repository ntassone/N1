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
      // Actions.draftParticipantsChanged.listen(this._onParticipantsChanged),
    ];
    NylasEnv.config.set(`nylas.signatures`, {})
  }

  deactivate() {
    this.unsubscribers.forEach(unsub => unsub());
  }

  _signatures = () => {
    return NylasEnv.config.get(`nylas.signatures`);
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
    const allSigs = this._signatures()
    const updatedSigs = this._removeByKey(allSigs, signatureToDelete.id)
    NylasEnv.config.set(`nylas.signatures`, updatedSigs)

    this.trigger()
  }

  // create method to query signatures - all signatures
  // when this calls trigger() -- onSignaturesChange willeb called

  _onAddSignature = (sigTitle = "Untitled") => {
    const newId = Utils.generateTempId()
    const updatedSigs = this._signatures()
    updatedSigs[newId] = {id: newId, title: sigTitle, body: DefaultSignature}
    NylasEnv.config.set(`nylas.signatures`, updatedSigs)

    this.trigger()
  }

  _onEditSignatureTitle = (editedTitle, oldSig) => {
    const updatedSigs = NylasEnv.config.get(`nylas.signatures`);
    updatedSigs[oldSig.id].title = editedTitle
    NylasEnv.config.set(`nylas.signatures`, updatedSigs)

    this.trigger()
  }


  _onEditSignatureBody = (editedBody, oldSig) => {
    const updatedSigs = NylasEnv.config.get(`nylas.signatures`);
    updatedSigs[oldSig.id].body = editedBody
    NylasEnv.config.set(`nylas.signatures`, updatedSigs)

    this.trigger()
  }

  // _onParticipantsChanged = (draftClientId, changes) => {
  //   if (!changes.from) { return; }
  //
  //   DraftStore.sessionForClientId(draftClientId).then((session) => {
  //     const draft = session.draft();
  //     const {accountId} = AccountStore.accountForEmail(changes.from[0].email);
  //     const signature = this.signatureForAccountId(accountId);
  //
  //     const body = SignatureUtils.applySignature(draft.body, signature);
  //     session.changes.add({body});
  //   });
  // }

  // _onSetSignatureForAccountId = ({signature, accountId}) => {
  //   // NylasEnv.config.set is internally debounced 100ms
  //   NylasEnv.config.set(`nylas.account-${accountId}.signature`, signature)
  // }
}

export default new SignatureStore();
