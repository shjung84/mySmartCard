import { defineBoot } from '#q-app/wrappers'
import _ from 'lodash'
import moment from 'moment'

import { func } from '../utils/function'

export default defineBoot(({ app }) => {
  app.config.globalProperties.$_ = _

  app.config.globalProperties.$formatDate = date => {
    return moment(date).format('YYYY.MM.DD HH:mm:ss')
  }

  // func
  app.config.globalProperties.$func = func
})
