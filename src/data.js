const DATA = {
  namai:
  [
    {id: 1, name: 'namas - 1', miestas: 1, rajonas: 1, gatve: 1},
    {id: 2, name: 'namas - 2', miestas: 1, rajonas: 2, gatve: 2},
    {id: 3, name: 'namas - 3', miestas: 1, rajonas: 2, gatve: 3},
    {id: 4, name: 'namas - 4', miestas: 2, rajonas: 3, gatve: 4},
    {id: 5, name: 'namas - 5', miestas: 2, rajonas: 3, gatve: 4},
    {id: 6, name: 'namas - 6', miestas: 2, rajonas: 3, gatve: 4},
    {id: 7, name: 'namas - 7', miestas: 2, rajonas: 3, gatve: 4},
    {id: 8, name: 'namas - 8', miestas: 2, rajonas: 3, gatve: 4},
  ],
  gatves:
  [
    {id: 1, name: 'gatve - 1', miestas: 1, rajonas: 1},
    {id: 2, name: 'gatve - 2', miestas: 1, rajonas: 2},
    {id: 3, name: 'gatve - 3', miestas: 1, rajonas: 2},
    {id: 4, name: 'gatve - 4', miestas: 2, rajonas: 3},
  ],
  rajonai:
  [
    {id: 1, name: 'rajonas - 1', miestas: 1},
    {id: 2, name: 'rajonas - 2', miestas: 1},
    {id: 3, name: 'rajonas - 3', miestas: 2},
  ],
  miestai:
  [
    {id: 1, name: 'miestas - 1'},
    {id: 2, name: 'miestas - 2'},
  ],
};

const dataFormat = {
  namai: {
    gatves: 'gatve',
    rajonai: 'rajonas',
    miestai: 'miestas',
  },
  gatves: {
    rajonai: 'rajonas',
    miestai: 'miestas',
  },
  rajonai: {
    miestai: 'miestas'
  },
  miestai: {
  }
}

export {DATA, dataFormat};
