import axios from 'axios';

const baseURL = 'http://localhost:3001/api/notes';

// const getAll = () => {
//   const request = axios.get(baseURL);
//   return request.then((response) => response.data);
// };

const getAll = () => {
  const request = axios.get(baseURL);
  const nonExisting = {
    id: 10000,
    content: 'this note is not saved to server',
    important: true,
  };
  return request.then((response) => {
    return response.data.concat(nonExisting);
  });
};

const create = (newObject) => {
  const request = axios.post(baseURL, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseURL}/${id}`, newObject);
  return request.then((response) => response.data);
};

// longer version
// export default {
//   getAll: getAll,
//   create: create,
//   update: update,
// };

// shorter version
export default { getAll, create, update };
