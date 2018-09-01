import invert from 'invert-color'
import {
  createModelSchema,
  identifier,
  primitive
} from 'serializr'

class Label {
  id = -1
  title = ''
  description = ''
  color = ''

  /**
   * Compare to another label.
   * returns negative values if < other
   * 0 if = other
   * positive values if > other
   */
  compareTo (other) {
    return this.title.localeCompare(other.title)
  }

  invertedColor () {
    return invert(this.color, true).substring(1)
  }
}

createModelSchema(Label, {
  id: identifier(),
  title: primitive(),
  description: primitive(),
  color: primitive()
})

export default Label
