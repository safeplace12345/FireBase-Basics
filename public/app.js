
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("form");
const filtersName = document.querySelector(".filtersName");
const filtersCity = document.querySelector(".filtersCity");
const advancedQuery = document.querySelector(".advancedQuery");

filtersName.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery.name(filtersName.input.value);
});
filtersCity.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(filtersCity.input.value);
  searchQuery.city(filtersCity.input.value);
});
advancedQuery.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = {
    name: advancedQuery.name.value,
    city: advancedQuery.city.value,
  };
  console.log(searchAdvancedQuery(value));
  //   searchQuery.city(filtersCity.input.value);
});

// Accessing Database
const DB = firebase.firestore();
// Destructuring collection data from database

const cafes = DB.collection("Cafes");

// Adding documents to the database
form.addEventListener("submit", (e) => {
  e.preventDefault();
  cafes.add({
    Name: form.name.value,
    City: form.city.value,
  });
  form.reset();
});

// Dom rendering
const renderer = (element) => {
  const doc = element.data();
  const li = document.createElement("li");
  const name = document.createElement("span");
  const city = document.createElement("span");
  const cross = document.createElement("div");
  name.innerText = doc.Name;
  city.innerText = doc.City;
  cross.innerText = "X";
  cross.addEventListener("click", deleteDoc);
  li.setAttribute("data-id", element.id);
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  return cafeList.appendChild(li);
};

// database collection returned
// .get() only fetches once on render note in realtime
// async function init() {
//   await cafes.get().then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderer(doc);
//     });
//   });
// }
// init();

// Using Realtime Updates with the onSnapshot meth...

async function realTimeInit() {
  return cafes.orderBy("Name").onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type === "added") {
        renderer(change.doc);
      } else if (change.type === "removed") {
        let li = document.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
}
realTimeInit();

//   Delete documents

function deleteDoc(e) {
  const id = e.target.parentNode.getAttribute("data-id");
  return cafes.doc(id).delete();
}

// Querying the searches on the DB
const searchQuery = {
  name(value) {
    return DB.collection("Cafes")
      .where("Name", "==", value)
      .get()
      .then((snapshot) => {
        console.log(snapshot);
      });
  },
  city(value) {
    return cafes
      .where("City", "==", value)
      .get()
      .then((snapshot) => {
        console.log(snapshot);
      });
  },
};
//Multiple queries that require indexing
const searchAdvancedQuery = (value) => {
  cafeList.innerHTML = "";
  return cafes
    .where("Name", "==", value.name)
    .where("City", "==", value.city)
    .get()
    .then((snapshot) => {
      return snapshot.docs.forEach((doc) => renderer(doc));
    });
};

// order docs with a sort mech.. from firestore
const orders = {
  city() {
    cafeList.innerHTML = "";
    cafes
      .orderBy("City")
      .get()
      .then((snapshot) => {
        return snapshot.docs.forEach((doc) => renderer(doc));
      });
  },
  name() {
    cafeList.innerHTML = "";
    cafes
      .orderBy("Name")
      .get()
      .then((snapshot) => {
        return snapshot.docs.forEach((doc) => renderer(doc));
      });
  },
};
document.querySelector(".sortName").addEventListener("click", orders.name);
document.querySelector(".sortCity").addEventListener("click", orders.city);
