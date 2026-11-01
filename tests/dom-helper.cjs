const { readFileSync } = require('node:fs');
const { join } = require('node:path');

class Element {
  constructor(tag = 'div', attributes = {}) {
    this.tag = tag;
    this.attributes = { ...attributes };
    this.children = [];
    this.listeners = {};
    this.dataset = {};
    this.style = {};
    this.value = attributes.value || '';
    this.disabled = 'disabled' in attributes;
    this._text = '';
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    });
    this.classList = {
      contains: name => this.className.split(/\s+/).includes(name),
      add: name => { if (!this.classList.contains(name)) this.className = (this.className + ' ' + name).trim(); },
      remove: name => { this.className = this.className.split(/\s+/).filter(value => value !== name).join(' '); },
      toggle: (name, force = !this.classList.contains(name)) => {
        if (force) this.classList.add(name); else this.classList.remove(name);
        return force;
      }
    };
  }
  get className() { return this.attributes.class || ''; }
  set className(value) { this.attributes.class = value; }
  get id() { return this.attributes.id; }
  set id(value) { this.attributes.id = value; }
  get href() { return this.attributes.href; }
  set href(value) { this.attributes.href = value; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set textContent(value) { this._text = String(value); this.children = []; }
  appendChild(child) { child.parent = this; this.children.push(child); return child; }
  append(...children) { children.forEach(child => this.appendChild(child)); }
  replaceChildren(...children) { this.children = []; this._text = ''; this.append(...children); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  contains(node) { return node === this || this.children.some(child => child.contains(node)); }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolledIntoView = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  matches(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    const attribute = selector.match(/^\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
    if (attribute) return attribute[2] === undefined ? Object.hasOwn(this.attributes, attribute[1]) : this.attributes[attribute[1]] === attribute[2];
    return this.tag === selector;
  }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  dispatch(type, properties = {}) {
    if (this.disabled && type === 'click') return;
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...properties };
    for (let node = this; node; node = node.parent) (node.listeners[type] || []).forEach(callback => callback(event));
    return event;
  }
}

function loadPage(filename) {
  const html = readFileSync(join(__dirname, '..', filename), 'utf8');
  const document = new Element('document');
  document.createElement = tag => new Element(tag);
  const stack = [document];
  const voidTags = new Set(['meta', 'link', 'input', 'img', 'br', 'hr']);
  for (const token of html.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (token.startsWith('<')) {
      const tag = token.match(/^<([^\s/>]+)/)[1];
      const attributes = {};
      const remainder = token.slice(tag.length + 1, -1);
      for (const match of remainder.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? '';
      const element = new Element(tag, attributes);
      stack.at(-1).appendChild(element);
      if (!voidTags.has(tag) && !token.endsWith('/>')) stack.push(element);
    } else stack.at(-1)._text += token;
  }
  return document;
}

const flush = () => new Promise(resolve => setImmediate(resolve));
module.exports = { Element, loadPage, flush };
