const FOREIGN = {
  gatves_id: 'gatves',
  rajonai_id: 'rajonai',
  miestai_id: 'miestai',
}
const FORMAT = {
  namai : ['id', 'name', 'miestai_id', 'gatves_id', 'rajonai_id'],
  gatves: ['id', 'name', 'rajonai_id', 'miestai_id'],
  rajonai : ['id', 'name', 'miestai_id'],
  miestai : ['id', 'name'],
}

async function select(categories, where = null) {
  let promises = [];

  for (let category of categories) {
    promises.push(fetch(`http://localhost:3004/${category}`));
  }

  let select = await Promise.all(promises).then(responses => {
    return Promise.all(responses.map(r => r.json()));
  }).then(json => {
    return json.reduce((a, b) => a.concat(b));
  });

  if (where) return where(select);
  else return select;
}

function remove(category, id) {
  return fetch(`http://localhost:3004/${category}/${id}`, {
    "method": "DELETE",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(response => response.json()).then(json => {
    // console.log(json);
  });


  // const newDATA = {...DATA};
  //
  // let fKey;
  // for (let key in FOREIGN) {
  //   if (FOREIGN[key] === category) {
  //     fKey = key;
  //     break;
  //   }
  // }
  //
  // const categories = Object.keys(FORMAT);
  // for(let c of categories) {
  //   if (FORMAT[c].includes(fKey)) {
  //     const cDATA = newDATA[c].slice();
  //     cDATA.forEach((item, index) => {
  //       if (item[fKey] === id) {
  //         cDATA[index] = {...item, [fKey] : null};
  //       }
  //     });
  //     newDATA[c] = cDATA;
  //   }
  // }
  //
  // newDATA[category] = newDATA[category].filter(item => item.id !== id);
}

function update(category, id, values) {
  return fetch(`http://localhost:3004/${category}/${id}`, {
    "method": "PUT",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    "body": JSON.stringify(values)
  }).then(response => response.json()).then(json => {
    // console.log(json);
  });
}

function insert(category, values) {
  return fetch(`http://localhost:3004/${category}`, {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(values)
  }).then(response => response.json()).then(json => {
    // console.log(json);
  });
}

function foreign(category) {
  const allFKeys = Object.keys(FOREIGN);
  const fKeys = FORMAT[category].filter(key => allFKeys.includes(key));
  return fKeys;
}

export {FORMAT, FOREIGN, select, remove, update, insert, foreign};
