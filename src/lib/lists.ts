export const getAllTodosFromAllLists = (lists: any[]): any[] => {
  const items = lists
    .map((list) =>
      list.children.map((child) => ({ ...child, listTitle: list.props.title }))
    )
    .flat()
    .filter((item) => item.type !== 'Todo' && !item.props.archived)
    .map((item) => ({
      id: item.props.id,
      title: item.props.title,
      list: item.listTitle,
    }))
    .filter((item, i, arr) => arr.some((a) => a.title !== item.title));
  return items;
};
