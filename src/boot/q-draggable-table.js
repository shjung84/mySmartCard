import { boot } from 'quasar/wrappers'

import qDraggableTable from 'quasar-ui-q-draggable-table'
import 'quasar-ui-q-draggable-table/dist/index.css'

export default boot(({ app }) => {
  app.use(qDraggableTable)
})
