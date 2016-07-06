/* eslint quote-props: 0 */
import {SignatureStore} from 'nylas-exports'

let SIGNATURES = {
  '1': {
    id: '1',
    title: 'one',
    body: 'first test signature!',
    defaultFor: {11: false, 22: false},
  },
  '2': {
    id: '2',
    title: 'two',
    body: 'Here is my second sig!',
    defaultFor: {11: true, 22: false},
  },
}

fdescribe('SignatureStore', function signatureStore() {
  beforeEach(() => {
    spyOn(NylasEnv.config, 'get').andCallFake(() => SIGNATURES)

    spyOn(SignatureStore, '_save').andCallFake(() => {
      NylasEnv.config.set(`nylas.signatures`, SignatureStore.signatures)
    })

    SignatureStore.activate()
  })


  describe('signatureForAccountId', () => {
    it('should return the default signature for that account', () => {
      const titleForAccount11 = SignatureStore.signatureForAccountId(11).title
      expect(titleForAccount11).toEqual(SIGNATURES['2'].title)
      const account22Def = SignatureStore.signatureForAccountId(33)
      expect(account22Def).toEqual(null)
    })
  })

  beforeEach(() => {
    spyOn(NylasEnv.config, 'set').andCallFake((notImportant, newObject) => {
      SIGNATURES = newObject
    })
  })
  describe('when the account is not selected - toggled off', () => {
    it('should make a signature default for this account', () => {
      SignatureStore._onToggleAccount(11)
      // for signature 1, toggle account 11 to true
      const titleForAccount11 = SignatureStore.signatureForAccountId(11).title
      expect(titleForAccount11).toEqual(SIGNATURES['1'].title)
    })
    it('should remove previous default signature', () => {
      // signature 2 used to be true for account 1, change this, only one default per account
      expect(SIGNATURES['2'].defaultFor[11]).toEqual(false)
    })
  })

  describe('toggleAccount', () => {
    describe('when the account is selected - toggled on', () => {
      it('should remove a signature as default for this account', () => {
        SignatureStore._onToggleAccount(11)
        expect(SignatureStore.signatureForAccountId(11)).toEqual(null)
      })
    })
  })
  describe('removeSignature', () => {
    it('should remove the signature from our list of signatures', () => {
      const toRemove = SIGNATURES[SignatureStore.selectedSignatureId]
      SignatureStore._onRemoveSignature(toRemove)
      expect(SIGNATURES['1']).toEqual(undefined)
    })
    it('should reset selectedSignatureId to a different signature', () => {
      const toRemove = SIGNATURES[SignatureStore.selectedSignatureId]
      SignatureStore._onRemoveSignature(toRemove)
      expect(SignatureStore.selectedSignatureId).toNotEqual('1')
    })
  })
})
