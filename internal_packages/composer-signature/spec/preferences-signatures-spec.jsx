import PreferencesSignatures from '../lib/preferences-signatures.jsx';
import {renderIntoDocument, findRenderedDOMComponentWithClass, Simulate} from 'react-addons-test-utils';
import React from 'react';
import {SignatureStore, Actions} from 'nylas-exports';


// TO TEST - preferences page
  // add signature adds it to the list
  // delete works
  // modify title
  // modify body
  // set as default adds the accountId to that sigs defaultFor list
  // remove as default works
const makeComponent = (props = {}) => {
  return renderIntoDocument(<PreferencesSignatures {...props} />)
}

fdescribe('PreferencesSignatures', function preferencesSignatures() {
  beforeEach(() => {
    this.component = makeComponent()
    // spyOn(this.component, 'setState')
    // spyOn(NylasEnv.config, 'get').andCallFake(() => TEST_SIGNATURES)
  })

  // describe('_onAddSignature', () => {
  //   it('adds a signature to the bar and selects it', () => {
  //     SignatureStore.getSignatures()
  //     this.component_onAddSignature()
  //   })
  // })
  describe('when there are no signatures', () => {
    it('should add a signature when you click the button', () => {
      spyOn(SignatureStore, 'getSignatures').andReturn({})
      this.component = makeComponent()
      spyOn(Actions, 'addSignature')
      this.button = findRenderedDOMComponentWithClass(this.component, 'btn-create-signature')
      Simulate.click(this.button)
      expect(Actions.addSignature).toHaveBeenCalled()
    })
  })
})
