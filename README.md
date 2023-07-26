# be-enhanced

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-enhanced?style=for-the-badge)](https://bundlephobia.com/result?p=be-enhanced)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-enhanced?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-enhanced.png)](http://badge.fury.io/js/be-enhanced)


be-enhanced provides a base class that enables "casting spells", or enhancing server-rendered DOM elements based on cross-cutting custom attributes.  These base classes can also be used during template instantiation for a more optimal repeated web component scenario. 

be-enhanced, which focuses on adding custom properties to an element, and [be-hive](https://github.com/bahrus/be-hive), which focuses on attaching the custom property based on the matching custom attribute, together form a user-land implementation of [this proposal](https://github.com/WICG/webcomponents/issues/1000), which has garnered an incredible amount of love, support, attention and helpful feedback.

be-enhanced provides a much more "conservative" alternative approach to enhancing existing DOM elements, in place of the controversial "is"-based customized built-in element [standard-ish](https://bkardell.com/blog/TheWalrus.html).  There are, however, a small number of use cases where the is-based built-in approach [may be](https://github.com/WebKit/standards-positions/issues/97) the preferred one.

In contrast to the "is" approach, we can apply multiple behaviors / decorators to the same element:

```html
#shadow-root (open)
<black-eyed-peas 
    be-on-the-next-level=11
    be-rocking-over-that-bass-tremble
    be-chilling-with-my-motherfuckin-crew
></black-eyed-peas>
```

which seems [more readable](https://opensource.com/article/19/12/zen-python-flat-sparse#:~:text=If%20the%20Zen%20was%20designed%20to%20be%20a,obvious%20than%20in%20Python%27s%20strong%20insistence%20on%20indentation.) than:

```html
<is-on-the-next-level level=11>
    <is-rocking-over-that-base-tremble>
        <is-chilling-with-my-motherfunckin-crew>
            <black-eyed-peas></black-eyed-peas>
        </is-chilling-with-my-motherfuckin-crew>
    </is-rocking-over-that-base-tremble>
</is-on-the-next-level>
```

Not to mention [concerns about performance](https://sitebulb.com/hints/performance/avoid-excessive-dom-depth/).  And then there's [this](https://github.com/WICG/webcomponents/issues/809).

## Priors

be-enhanced's goals are [quite](https://github.com/lume/element-behaviors) [similar](https://knockoutjs.com/documentation/custom-bindings.html) [to](https://medium.com/@_edhuang/add-a-custom-attribute-to-an-ember-component-81f485f8d997) [what](https://twitter.com/biondifabio/status/1530474444266823682) [is](https://docs.astro.build/en/reference/directives-reference/#:~:text=Template%20directives%20are%20a%20special%20kind%20of%20HTML,life%20easier%20%28like%20using%20class%3Alist%20instead%20of%20class%29.) [achieved](https://alpinejs.dev/) via [things](https://htmx.org/docs/) [that](https://vuejs.org/v2/guide/custom-directive.html) [go](https://docs.angularjs.org/guide/directive) [by](https://dojotoolkit.org/reference-guide/1.10/quickstart/writingWidgets.html) [many](https://aurelia.io/docs/templating/custom-attributes#simple-custom-attribute) [names](https://svelte.dev/docs#template-syntax-element-directives).

We prefer (progressive) "enhancement" as the term, but ["decorator"](https://en.wikipedia.org/wiki/Decorator_pattern),  "[cross-cutting] [custom attribute](https://github.com/matthewp/custom-attributes)", "directive", ["behavior"](https://github.com/lume/element-behaviors)  are also acceptable terms.

Differences to these solutions (perhaps):

1. This can be used independently of any framework (web component based).
2. Each decorator can be imported independently of others via an ES6 module.
3. Definition is class-based, but with functional reactive ways of organizing the code ("FROOP")
4. Applies exclusively within Shadow DOM realms.
5. Reactive properties are managed declaratively via JSON syntax.
6. Namespace collisions easily avoidable within each shadow DOM realm.
7. Use of namespaced properties allows multiple vendors to apply different enhancements simultaneously.
8. be-enhanced provides "isomorphic" support for using the same declarative syntax while transforming templates during template instantiation, as well as while the DOM is sitting in the live DOM tree.  But the critical feature is that if the library is not yet loaded during template instantiation, *nuk ka problem*, the live DOM decorator can apply the logic progressively when the library is loaded.  Meaning we can punt during template instantiation, so that render blocking is avoided.  And if the library *is* loaded prior to template instantiation, it can still be supplemented by the live DOM decorator, but the initial work performed during the template instantiation can be skipped by the live DOM decorator.

Prior to that, there was the heretical [htc behaviors](https://en.wikipedia.org/wiki/HTML_Components).

## Examples of constructing a be-enhanced progressive enhancement decorator:

| Enhancement         | Purpose                                                                                         | Code                     |
|---------------------|-------------------------------------------------------------------------------------------------|--------------------------|
| be-adoptive         | [Adopt](https://github.com/bahrus/be-aoptive) styles from parent shadow realm                   | [code](https://github.com/bahrus/be-adoptive/blob/baseline/be-adoptive.ts)                        |
| be-a-beacon         | [Announce](https://github.com/bahrus/be-a-beacon) arrival of (last) element in HTML Stream      | [code](https://github.com/bahrus/be-a-beacon/blob/baseline/be-a-beacon.ts)                        |
| be-based            | Adjust URLs from a [base](https://github.com/bahrus/be-based) URL                               | [code](https://github.com/bahrus/be-based/blob/baseline/be-based.ts)  |
| be-bound            | Provide two-way [binding](https://github.com/bahrus/be-bound)                                   | [code](https://github.com/bahrus/be-bound/blob/baseline/be-bound.ts)  |
| be-buttoned-up      | Make a button link to [button menu in popover](https://github.com/bahrus/be-buttoned-up)        | [code](https://github.com/bahrus/be-buttoned-up/blob/baseline/be-buttoned-up.ts)  |
| be-channeling       | [Channel](https://github.com/bahrus/be-channeling) events to the host element.                  | [code](https://github.com/bahrus/be-channeling/blob/baseline/be-channeling.ts)  |
| be-clonable         | Make DOM element be [clonable](https://github.com/bahrus/be-clonable)                           | [code](https://github.com/bahrus/be-clonable/blob/baseline/be-clonable.ts)  |
| be-committed        | [Trigger](https://github.com/bahrus/be-committed) a button click on keyboard "enter"            | [code](https://github.com/bahrus/be-committed/blob/baseline/be-committed.ts)                       |
| be-counted          | [Track and share](https://github.com/bahrus/be-counted) how many times button has been clicked. | [code](https://github.com/bahrus/be-counted/blob/baseline/be-counted.ts)                         |
| be-definitive       | [Define](https://github.com/bahrus/be-definitive) web component from existing DOM in tree.      | [code](https://github.com/bahrus/be-definitive/blob/baseline/be-definitive.ts) |
| be-delible          | Make DOM elemenet be [deletable](https://github.com/bahrus/be-delible)                          | [code](https://github.com/bahrus/be-delible/blob/baseline/be-delible.ts)  |
| be-derived          | [Derive](https://github.com/bahrus/be-derived) state from server-rendered HTML                  | [code](https://github.com/bahrus/be-derived/blob/baseline/be-derived.ts)  |
| be-exportable       | Allow script tag to [export](https://github.com/bahrus/be-exportable) itself as a module        | [code](https://github.com/bahrus/be-exportable/blob/baseline/be-exportable.ts)  |
| be-formidable       | Enhance the form's [validation](https://github.com/bahrus/be-formidable) abilities.             | [code](https://github.com/bahrus/be-formidable/blob/baseline/be-formidable.ts)  |
| be-functional       | [Connect](https://github.com/bahrus/be-functional) script to DOM elements.                      | [code](https://github.com/bahrus/be-functional/blob/baseline/be-functional.ts)  |
| be-intl             | [Format](https://github.com/bahrus/be-intl) numbers using intl.NumberFormat.                    | [code](https://github.com/bahrus/be-intl/blob/baseline/be-intl.ts)  |
| be-it               | [Forward](https://github.com/bahrus/be-it) props to adjacent element.                           | [code](https://github.com/bahrus/be-it/blob/baseline/be-it.ts)  |
| be-promising        | Run enhancements in a [predictable order](https://github.com/bahrus/be-promising)               | [code](https://github.com/bahrus/be-promising/blob/baseline/be-promising.ts)    |
| be-scoped           | Create an EventTarget associated with the adorned element that can hold [scoped](https://github.com/bahrus/be-scoped) state. | [code](https://github.com/bahrus/be-scoped/blob/baseline/be-scoped.ts)    |
| be-typed            | Allow the user to customize [input](https://github.com/bahrus/be-typed) element during run time.  | [code](https://github.com/bahrus/be-typed/blob/baseline/be-typed.ts) |
| be-valued           | Reflect the [value](https://github.com/bahrus/be-valued) of the input to the value attribute on input event.                           | [code](https://github.com/bahrus/be-valued/blob/baseline/be-valued.ts)
| be-written          | [Stream](https://github.com/bahrus/be-written) a url to a target DOM element.                   | [code](https://github.com/bahrus/be-written/blob/baseline/be-written.ts)

## The be-enhancement api

be-enhancement commits the cardinal sin of attaching a custom property gateway, "beEnhanced" on all Elements.  Being that the platform has shown little to no interest in providing support for progressive enhancement over many decades when such solutions have proven useful, we should feel no guilt whatsoever.

Having this property gateway is a life-saver as far as performance and providing an easy way of integrating enhancements into (some) frameworks.

To set a value on a namespaced property (e.g. via a framework), do the following:

```JavaScript
await customElements.whenDefined('be-enhanced');
const base = myElement.beEnhanced.by.aButterBeerCounter;
Object.assign(base, {count: 7});
```

This should work just fine even if the enhancement a-butter-beer-counter hasn't loaded yet.  The enhancement will absorb the settings the moment it becomes attached to the element it is enhancing.

## Server-rendered HTML vs Template Instantiated HTML

If the HTML we are working with is rendered by the server, the most effective way of activating the custom enhancement is via the associated attribute:

```html
<button be-counted>Count me</button>
```

However, activating enhancements via attributes is not ideal when using client side api's to build the API, such as during template instantiation.

As we stated so very long ago, the way to do this most effectively programmatically is:

```JavaScript
import('be-counted/be-counted.js');
await customElements.whenDefined('be-enhanced');
const base = myElement.beEnhanced.by.beCounted;
Object.assign(base, {value: 7});
```

In the example above, we are importing the dependency asynchronously using the dynamic import.  This means that depending on the timing the hydration of the enhancement may be done during template instantiation (for example), or after the element being enhanced has been added to the live DOM tree.

Using dynamic import as shown above has the benefit that the dependency will not cause the template instantiation to be render blocked.

## Event Notifications

Be-enhancement element decorators/behaviors typically don't, by default, emit events that get bubbled up the DOM tree.

To subscribe to an event:

```JavaScript
const myEnhancement = await myElement.beEnhanced.whenDefined('my-enhancement');
myEnhancement.addEventListener('resolved', e => {

})
```

## Alternate attribute names

To be HTML5 compliant, use data-[enh-by-name-of-enhancement].  If enhancing a custom element, chances are significant that the custom element may support an attribute that matches your (short name).  To make the chances of this approach nil, the companion to be-enhanced mentioned above, be-hive, only recognizes attributes that start with enh-by- or data-enh-by when attached to a custom element.