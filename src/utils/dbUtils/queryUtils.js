const parseQueryParams = (query) => {
    const { filter, sort } = query;
    const where = {};
    const order = [];
  
    // Filter
    if (filter) {
      try {
        const filters = JSON.parse(filter); //JSON: "email":"example@gmail.com"
        Object.keys(filters).forEach((key) => {
          where[key] = filters[key];
        });
      } catch (error) {
        throw new Error('Invalid filter format');
      }
    }
  
    // Sort
    if (sort) {
      const sorts = sort.split(','); //"username:asc,email:desc"
      sorts.forEach((sortField) => {
        const [field, direction = 'ASC'] = sortField.split(':');
        order.push([field, direction.toUpperCase()]);
      });
    }
    
    //GET /api/users?filter={"email":"example@gmail.com"}&sort=username:desc
  
    return { where: Object.keys(where).length ? where : undefined, order: order.length ? order : undefined };
  };
  
  module.exports = { parseQueryParams };