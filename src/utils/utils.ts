// import $ from 'jquery';

export default function parentsUntil(
  el: Element,
  selector: string,
  filter?: string,
): Element[] {
  // return $(el).parentsUntil(selector, filter);
  const result = [];
  const matchesSelector = el.matches || el.webkitMatchesSelector;

  // match start from parent
  el = el.parentElement as Element;
  while (el && !matchesSelector.call(el, selector)) {
    if (!filter) {
      result.push(el);
    } else {
      matchesSelector.call(el, filter) && result.push(el);
      if (matchesSelector.call(el, filter)) {
        result.push(el);
      }
    }
    el = el.parentElement as Element;
  }
  return result;
}
