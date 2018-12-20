import { flattern, sortByFixed } from '../../_utils'

export default {
  name: 'HkmColgroup',

  inject: ['store'],

  render(h) {
    let store = this.store;

    let columns = flattern(
      sortByFixed(store.columns), 
      'children', 
      column => column.isLeaf
    );

    return (
      <colgroup>
        {
          columns.map((column, k) => {

            if (column.width) {
              return <col key={ k } width={ column.width } />
            } else {
              return <col key={ k } />
            }
          })
        }
      </colgroup>
    );
  }
}