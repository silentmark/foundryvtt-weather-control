// eslint-disable-next-line no-undef
let gameMock = jest.genMockFromModule('game');
let __mockGame = {};

__mockGame.settings = {
  register: () => { return true; }
};

gameMock = __mockGame;

export default gameMock;
