import { defineBoot } from '#q-app/wrappers'
import _ from 'lodash'
import moment from 'moment'

export default defineBoot(({ app }) => {
  app.config.globalProperties.$_ = _

  app.config.globalProperties.$formatDate = date => {
    return moment(date).format('YYYY.MM.DD HH:mm:ss')
  }
})
