module.exports = {
  findAll: async function weekSearchQuery(query){
    return Week.find(query);
  },
  find: async function weekSearchQuery(query){
    return Week.findOne(query);
  },
  update:async function weekUpdateQuery(query, operation){
    return Week.updateOne(query, operation)
  },
  delete:async function weekDeleteQuery(query){
    return Week.deleteOne(query);
  },
  findAllSort:async function findAllSort(query,sortType){
    return Week.find(query).sort(sortType);
  },
  deleteMany: async function weekDeleteManyQuery(query) {
    return Week.deleteMany(query);
  },
}
