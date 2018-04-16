const FOREIGN = {
  gatves_id: 'gatves',
  rajonai_id: 'rajonai',
  miestai_id: 'miestai',
}
const SCHEMA = {
  namai : ['id', 'name', 'miestai_id', 'gatves_id', 'rajonai_id', 'location'],
  gatves: ['id', 'name', 'rajonai_id', 'miestai_id'],
  rajonai : ['id', 'name', 'miestai_id'],
  miestai : ['id', 'name'],
}


function select(category) {
  return fetch(`http://localhost:3004/${category}`, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(response => {
    return response.json();
  });
}


// async function select(categories, where = null) {
//   let promises = [];
//
//   for (let category of categories) {
//     promises.push(fetch(`http://localhost:3004/${category}?_page=5&_limit=20`));
//   }
//
//   let select = await Promise.all(promises).then(responses => {
//     console.log(responses["X-Total-Count"]);
//     return Promise.all(responses.map(r => r.json()));
//   }).then(json => {
//     return json.reduce((a, b) => a.concat(b));
//   });
//
//   if (where) return where(select);
//   else return select;
// }

function remove(category, id) {
  return fetch(`http://localhost:3004/${category}/${id}`, {
    "method": "DELETE",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
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

//isskaiciuoja kokius foreign kejus turi tam tikros kategorijos itemas. Funkcija grazina
//foreign keju pavadinimu masyva pvz: ['a_id', 'b_id']
function foreign(category) {
  const allFKeys = Object.keys(FOREIGN);
  const fKeys = SCHEMA[category].filter(key => allFKeys.includes(key));
  return fKeys;
}

//daro ta pati ka ir pries tai funkcija tiktais grazina objektu masyva, objekta sudaro
//du properciai key, category. Tai yra foreign kejaus pavadinimas ir kategorija i kuria jis rodo
//pvz: [{key: miestai_id, category: miestai}, {key: zoles_id, category: zoles}]
function foreign2(category) {
  const allForeign = Object.keys(FOREIGN);
  const foreign = SCHEMA[category].filter(key => allForeign.includes(key));
  return foreign.map(key => {
    const category = FOREIGN[key];
    return {
      category,
      key
    };
  });
}




export {SCHEMA, FOREIGN, select, remove, update, insert, foreign, foreign2};
