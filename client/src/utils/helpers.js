export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to shop shop with version 1
    const request = window.indexedDB.open('shop-shop', 1); 

    // createvariables to hold ref to db, trans, and store
    let db, tx, store; 

    //  if version changed or on first time, 
    request.onupgradeneeded = function(e) {
      const db = request.result; 

      // create obj store for data and set primary key indeces 
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' }); 
    }

    // handle errrors with connecting
    request.onerror = function(e) {
      console.log('There was an error'); 
    }

    // on database open success
    request.onsuccess = function(e) {
      // save ref of db to 'db' variable
      db = request.result; 
      // open transact to do what we pass into storename
      tx = db.transaction(storeName, 'readwrite'); 
      // save ref to object store
      store = tx.objectStore(storeName); 

      // if any errors, let us know
      db.onerror = function(e) {
        console.log('errr', e); 
      }

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }
      
      // when transaction complete, close connection
      tx.oncomplete = function() {
        db.close();
      }
    }
  })
}
