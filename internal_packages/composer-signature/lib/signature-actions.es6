import Reflux from 'reflux';

const ActionNames = [
  'addSignature',
  'removeSignature',
  'updateSignatureTitle',
  'updateSignatureBody',
  'selectSignature',
];

const Actions = Reflux.createActions(ActionNames);
ActionNames.forEach((name) => {
  Actions[name].sync = true;
});

export default Actions;
