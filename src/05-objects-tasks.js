/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
  return this;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class NewBuilder {
  constructor() {
    this.selectorString = '';
    this.elemHas = false;
    this.idHas = false;
    this.pseudoHas = false;
    this.order = 0;
    this.errorText = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.errorOrderText = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element(value) {
    this.checThisKeyCount('elemHas');
    this.checOrder(0);
    this.selectorString += `${value}`;
    return this;
  }

  id(value) {
    this.checThisKeyCount('idHas');
    this.checOrder(1);
    this.selectorString += `#${value}`;
    return this;
  }

  class(value) {
    this.checOrder(2);
    this.selectorString += `.${value}`;
    return this;
  }

  attr(value) {
    this.checOrder(3);
    this.selectorString += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.checOrder(4);
    this.selectorString += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.checThisKeyCount('pseudoHas');
    this.checOrder(5);
    this.selectorString += `::${value}`;
    return this;
  }

  stringify() {
    return this.selectorString;
  }

  checThisKeyCount(key) {
    if (this[key]) {
      throw Error(this.errorText);
    } else {
      this[key] = true;
    }
  }

  checOrder(order) {
    if (this.order > order) {
      throw Error(this.errorOrderText);
    } else {
      this.order = order;
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return this.checThisHasKey()
      ? this.element(value)
      : new NewBuilder().element(value);
  },

  id(value) {
    return this.checThisHasKey()
      ? this.id(value)
      : new NewBuilder().id(value);
  },

  class(value) {
    return this.checThisHasKey()
      ? this.class(value)
      : new NewBuilder().class(value);
  },

  attr(value) {
    return this.checThisHasKey()
      ? this.attr(value)
      : new NewBuilder().attr(value);
  },

  pseudoClass(value) {
    return this.checThisHasKey()
      ? this.pseudoClass(value)
      : new NewBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return this.checThisHasKey()
      ? this.pseudoElement(value)
      : new NewBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new NewBuilder().element(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },

  stringify() {
    return this.selectorString;
  },

  checThisHasKey(key = 'selectorString') {
    return key in this;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
