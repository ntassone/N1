import Reflux from 'reflux';

const ActionNames = [
  'setSignatureForAccountId',
  'addSignature',
  'removeSignature',
  'updateSignature',
  // add
  // remove
  // update

];

const Actions = Reflux.createActions(ActionNames);
ActionNames.forEach((name) => {
  Actions[name].sync = true;
});

export default Actions;
