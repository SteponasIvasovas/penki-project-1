const DATA = {
  namai:
  [
    {id: 1, name: 'grazus namas - 1', miestas: 1, rajonas: 1, gatve: 1},
    {id: 2, name: 'grazus namas - 2', miestas: 1, rajonas: 2, gatve: 2},
    {id: 3, name: 'grazus namas - 3', miestas: 1, rajonas: 2, gatve: 3},
    {id: 4, name: 'grazus namas - 4', miestas: 2, rajonas: 3, gatve: 4},
    {id: 5, name: 'grazus namas - 5', miestas: 2, rajonas: 3, gatve: 4},
    {id: 6, name: 'grazus namas - 6', miestas: 2, rajonas: 3, gatve: 4},
    {id: 7, name: 'grazus namas - 7', miestas: 2, rajonas: 3, gatve: 4},
    {id: 8, name: 'grazus namas - 8', miestas: 2, rajonas: 3, gatve: 4},
  ],
  gatves:
  [
    {id: 1, name: 'grazi gatve - 1', miestas: 1, rajonas: 1},
    {id: 2, name: 'grazi gatve - 2', miestas: 1, rajonas: 2},
    {id: 3, name: 'grazi gatve - 3', miestas: 1, rajonas: 2},
    {id: 4, name: 'grazi gatve - 4', miestas: 2, rajonas: 3},
  ],
  rajonai:
  [
    {id: 1, name: 'grazus rajonas - 1', miestas: 1},
    {id: 2, name: 'grazus rajonas - 2', miestas: 1},
    {id: 3, name: 'grazuras rajonas - 3', miestas: 2},
  ],
  miestai:
  [
    {id: 1, name: 'grazus miestas - 1'},
    {id: 2, name: 'grazus miestas - 2'},
  ],
};

const dataFormat = {
  namai: {
    gatves: 'Gatve',
    rajonai: 'Rajonas',
    miestai: 'Miestas',
  },
  gatves: {
    rajonai: 'Rajonas',
    miestai: 'Miestas',
  },
  rajonai: {
    miestai: 'Miestas'
  },
  miestai: {
  }
}

export {DATA, dataFormat};
