export default (data: any) => {
  const stores = data.map((element: any) => {
    return element.product.store.id;
  });

  const total_store = new Set(stores);

  return total_store.size;
};
