/* eslint quote-props: 0 */
import PreferencesSignatures from '../lib/preferences-signatures.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import React from 'react';
import {SignatureStore, Actions} from 'nylas-exports';

const SIGNATURES = {
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

const makeComponent = (props = {}) => {
  return ReactTestUtils.renderIntoDocument(<PreferencesSignatures {...props} />)
}

fdescribe('PreferencesSignatures', function preferencesSignatures() {
  this.component = null

  describe('when there are no signatures', () => {
    it('should add a signature when you click the button', () => {
      spyOn(SignatureStore, 'getSignatures').andReturn({})
      spyOn(SignatureStore, 'selectedSignature')
      this.component = makeComponent()
      spyOn(Actions, 'addSignature')
      this.button = ReactTestUtils.findRenderedDOMComponentWithClass(this.component, 'btn-create-signature')
      ReactTestUtils.Simulate.mouseDown(this.button)
      expect(Actions.addSignature).toHaveBeenCalled()
    })
  })

  describe('when there are signatures', () => {
    beforeEach(() => {
      spyOn(SignatureStore, 'getSignatures').andReturn(SIGNATURES)
      spyOn(SignatureStore, 'selectedSignature').andReturn(SIGNATURES['1'])
      this.component = makeComponent()
    })
    it('should add a signature when you click the plus button', () => {
      spyOn(Actions, 'addSignature')
      this.plus = ReactTestUtils.scryRenderedDOMComponentsWithClass(this.component, 'btn-editable-list')[0]
      ReactTestUtils.Simulate.click(this.plus)
      expect(Actions.addSignature).toHaveBeenCalled()
    })
    it('should delete a signature when you click the minus button', () => {
      spyOn(Actions, 'removeSignature')
      this.minus = ReactTestUtils.scryRenderedDOMComponentsWithClass(this.component, 'btn-editable-list')[1]
      ReactTestUtils.Simulate.click(this.minus)
      expect(Actions.removeSignature).toHaveBeenCalledWith(SIGNATURES['1'])
    })
    it('should toggle default status when you click an email on the dropdown', () => {
      spyOn(Actions, 'toggleAccount')
      this.account = ReactTestUtils.scryRenderedDOMComponentsWithClass(this.component, 'item')[0]
      ReactTestUtils.Simulate.mouseDown(this.account)
      expect(Actions.toggleAccount).toHaveBeenCalledWith('test-account-server-id')
    })
    it('should set the selected signature when you click on one that is not currently selected', () => {
      spyOn(Actions, 'selectSignature')
      this.item = ReactTestUtils.scryRenderedDOMComponentsWithClass(this.component, 'list-item')[1]
      ReactTestUtils.Simulate.click(this.item)
      expect(Actions.selectSignature).toHaveBeenCalledWith('2')
    })
    it('should modify the signature body when edited', () => {
      spyOn(Actions, 'updateSignatureBody')
      const newText = 'Changed <strong>NEW 1 HTML</strong><br>'
      this.component._onEditSignatureBody({target: {value: newText}});
      expect(Actions.updateSignatureBody).toHaveBeenCalled()
    })
    it('should modify the signature title when edited', () => {
      spyOn(Actions, 'updateSignatureTitle')
      const newTitle = 'Changed'
      this.component._onEditSignatureTitle(newTitle, SIGNATURES['1'].title)
      expect(Actions.updateSignatureTitle).toHaveBeenCalled()
    })
  })
})
