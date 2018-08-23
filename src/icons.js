import Vue from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faClock,
  faCopy
} from '@fortawesome/free-regular-svg-icons'
import {
  faClock as faClockDark,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCheck,
  faLayerGroup,
  faMinus,
  faPencilAlt,
  faPlay,
  faPlus,
  faTimes,
  faUndo
} from '@fortawesome/free-solid-svg-icons'

library.add(faArrowDown)
library.add(faArrowLeft)
library.add(faArrowRight)
library.add(faArrowUp)
library.add(faCheck)
library.add(faClock)
library.add(faClockDark)
library.add(faCopy)
library.add(faLayerGroup)
library.add(faMinus)
library.add(faPencilAlt)
library.add(faPlay)
library.add(faPlus)
library.add(faTimes)
library.add(faUndo)

Vue.component('font-awesome-icon', FontAwesomeIcon)
