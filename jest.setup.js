global.IS_REACT_ACT_ENVIRONMENT = true;

const OriginalAggregateError = globalThis.AggregateError;
globalThis.AggregateError = function (errors, message) {
  for (const err of errors) {
    console.error('AggregateError inner:', err);
  }
  return new OriginalAggregateError(errors, message);
};

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...RealModule,
    PaperProvider: ({ children }) => children,
    Portal: ({ children }) => children,
    Modal: ({ children, visible, ...rest }) =>
      visible ? React.createElement(View, rest, children) : null,
  };
});
