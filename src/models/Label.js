import {
  createModelSchema,
  identifier,
  primitive
} from 'serializr'

class Label {
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
}

createModelSchema(Label, {
  title: identifier(),
  description: primitive(),
  color: primitive()
})

export default Label
