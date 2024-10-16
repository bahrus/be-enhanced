# be-enhanced [WIP]

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-enhanced?style=for-the-badge)](https://bundlephobia.com/result?p=be-enhanced)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-enhanced?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-enhanced.png)](http://badge.fury.io/js/be-enhanced)


*be-enhanced* provides a base class that attaches a custom class instance onto a third party (built-in or custom) element.  It supplements *be-hive*.  The pair of packages  enables "casting spells", or enhancing server-rendered DOM elements, based on cross-cutting custom attributes.  These base classes can also be used during template instantiation for a more optimal repeated web component scenario, via "non verbal spells". 

be-enhanced, which focuses on adding custom properties to an element, and [be-hive](https://github.com/bahrus/be-hive), which focuses on attaching and forwarding attributes values to the custom property based on a list of one or more attributes to observe, together form a simplified userland implementation of [this proposal](https://github.com/WICG/webcomponents/issues/1000).  Based on the [really nice idea](https://github.com/WICG/webcomponents/issues/1029#issuecomment-1719996635) of supporting multiple attributes, this component in particular, *be-enhanced* is oblivious to any attributes, leaving the magic of tying the knot between attributes and associated enhancements to *be-hive* exclusively.  

*be-enhanced*, together with *be-hive*, provide a much more "conservative" alternative approach to enhancing existing DOM elements, in place of the controversial "is"-based customized built-in element [standard-ish](https://bkardell.com/blog/TheWalrus.html).  There are, however, a small number of use cases where the is-based built-in approach [may be](https://github.com/WebKit/standards-positions/issues/97) the preferred one.

In contrast to the "is" approach, we can apply multiple behaviors / decorators / enhancements to the same element:

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

| Enhancement         | Purpose                                                                                                | Code                                                                                                        |
|---------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| be-adoptive         | [Adopt](https://github.com/bahrus/be-adoptive) styles from parent shadow realm                         | [code](https://github.com/bahrus/be-adoptive/blob/baseline/be-adoptive.js)                                  |
| be-a-beacon         | [Announce](https://github.com/bahrus/be-a-beacon) arrival of (last) element in HTML Stream             | [code](https://github.com/bahrus/be-a-beacon/blob/baseline/be-a-beacon.js)                                  |
| be-based            | Adjust URLs from a [base](https://github.com/bahrus/be-based) URL                                      | [code](https://github.com/bahrus/be-based/blob/baseline/be-based.js)                                        |
| be-bound            | Provide two-way [binding](https://github.com/bahrus/be-bound)                                          | [code](https://github.com/bahrus/be-bound/blob/baseline/be-bound.js)                                        |
| be-buttoned-up      | Make a button link to [button menu in popover](https://github.com/bahrus/be-buttoned-up)               | [code](https://github.com/bahrus/be-buttoned-up/blob/baseline/be-buttoned-up.js)                            |
| be-channeling       | [Channel](https://github.com/bahrus/be-channeling) events to the host element.                         | [code](https://github.com/bahrus/be-channeling/blob/baseline/be-channeling.js)                              |
| be-clonable         | Make DOM element be [clonable](https://github.com/bahrus/be-clonable)                                  | [code](https://github.com/bahrus/be-clonable/blob/baseline/be-clonable.js)                                  |
| be-committed        | [Trigger](https://github.com/bahrus/be-committed) a button click on keyboard "enter"                   | [code](https://github.com/bahrus/be-committed/blob/baseline/be-committed.js)                                |
| be-computed         | [Compute values from other HTML signals via local script tags.](https://github.com/bahrus/be-computed) | [code](https://github.com/bahrus/be-computed/blob/baseline/be-computed.js)                                  |
| be-counted          | [Track and share](https://github.com/bahrus/be-counted) how many times button has been clicked.        | [code](https://github.com/bahrus/be-counted/blob/baseline/be-counted.js)                                    |
| be-definitive       | [Define](https://github.com/bahrus/be-definitive) web component from existing DOM in tree.             | [code](https://github.com/bahrus/be-definitive/blob/baseline/be-definitive.js)                              |
| be-delible          | Make DOM element be [deletable](https://github.com/bahrus/be-delible)                                  | [code](https://github.com/bahrus/be-delible/blob/baseline/be-delible.js)                                    |
| be-derived          | [Derive](https://github.com/bahrus/be-derived) state from server-rendered HTML                         | [code](https://github.com/bahrus/be-derived/blob/baseline/be-derived.js)                                    |
| be-detail-oriented  | Make the fieldset [expandable](https://github.com/bahrus/be-detail-oriented).                          | [code](https://github.com/bahrus/be-detail-oriented)                                                        |
| be-dispatching      | [Dispatch](https://github.com/bahrus/be-dispatching) event with specified name.                        | [code](https://github.com/bahrus/be-dispatching/blob/baseline/be-dispatching.js)                            |
| be-elevating        | [Elevate](https://github.com/bahrus/be-elevating) local property value to upstream element.            | [code](https://github.com/bahrus/be-elevating)                                                              |
| be-entrusting       | [Derive](https://github.com/bahrus/be-entrusting)  initial value from server streamed semantic HTML.   | [code](https://github.com/bahrus/be-entrusting/blob/baseline/be-entrusting.js)                              |
| be-exportable       | Allow script tag to [export](https://github.com/bahrus/be-exportable) itself as a module               | [code](https://github.com/bahrus/be-exportable/blob/baseline/be-exportable.js)                              |
| be-fetching         | [Fetch](https://github.com/bahrus/be-fetching) resource based on url property                          | [code](https://github.com/bahrus/be-fetching/blob/baseline/be-fetching.js)                                  |
| be-formidable       | Enhance the form's [validation](https://github.com/bahrus/be-formidable) abilities.                    | [code](https://github.com/bahrus/be-formidable/blob/baseline/be-formidable.js)                              |
| be-functional       | [Connect](https://github.com/bahrus/be-functional) script to DOM elements.                             | [code](https://github.com/bahrus/be-functional/blob/baseline/be-functional.js)                              |
| be-importing        | [Import](https://github.com/bahrus/be-importing) Static, Declarative HTML Web Components with Streaming HTML | [code](https://github.com/bahrus/be-importing/blob/baseline/be-importing.js)                          |
| be-inclusive        | [Include](https://github.com/bahrus/be-inclusive) content from nearby templates                        | [code](https://github.com/bahrus/be-inclusive/blob/baseline/be-inclusive.js)                                |
| be-intl             | [Format](https://github.com/bahrus/be-intl) numbers using intl.NumberFormat.                           | [code](https://github.com/bahrus/be-intl/blob/baseline/be-intl.js)                                          |
| be-invoking         | [Invoke](https://github.com/bahrus/be-invoking) method on upstream peer element or the host.           | [code](https://github.com/bahrus/be-invoking/blob/baseline/be-invoking.js)                                  |
| be-it               | [Forward](https://github.com/bahrus/be-it) props to adjacent element.                                  | [code](https://github.com/bahrus/be-it/blob/baseline/be-it.js)                                              |
| be-lazy             | [Load](https://github.com/bahrus/be-lazy) template when it scrolls into view                           | [code](https://github.com/bahrus/be-lazy/blob/baseine/be-lazy.js)                                           |
| be-linked           | [Connect](https://github.com/bahrus/be-linked) HTML (web) components together with readabe syntax      | [code](https://github.com/bahrus/be-linked/blob/baseline/be-linked.js)                                      |
| be-literate         | [Enhance](https://github.com/bahrus/be-literate) the input element so it can read local files          | [code](https://github.com/bahrus/be-literate/blob/baseline/be-literate.js)                                  |
| be-memed            | [Cache](https://github.com/bahrus/be-memed) templates contained within templates                       | [code](https://github.com/bahrus/be-memed/blob/baseline/be-memed.js)                                        |
| be-observant        | [One-way-bind](https://github.com/bahrus/be-observant) from the host or a peer element.                | [code](https://github.com/bahrus/be-observant/blob/baseline/be-observant.js)                                |
| be-promising        | Run enhancements in a [predictable order](https://github.com/bahrus/be-promising)                      | [code](https://github.com/bahrus/be-promising/blob/baseline/be-promising.js)                                |
| be-prop-slotting    | [Transfer](https://github.com/bahrus/be-prop-slotting) values from light children to host.             | [code](https://github.com/bahrus/be-prop-slotting/blob/baseline/be-prop-slotting.js)                        |
| be-propagating      | [Publish](https://github.com/bahrus/be-propagating) property changes to adorned element.               | [code](https://github.com/bahrus/be-propagating/blob/baseline/be-propagating.js)                            |
| be-repeated         | [Repeat](https://github.com/bahrus/be-repeated) section of HTML                                        | [code](https://github.com/bahrus/be-repeated/blob/baseline/be-repeated.js)                                  |
| be-scoped           | Create an EventTarget associated with the adorned element that can hold [scoped](https://github.com/bahrus/be-scoped) state. | [code](https://github.com/bahrus/be-scoped/blob/baseline/be-scoped.js)                |
| be-searching        | Make a DOM element [searchable](https://github.com/bahrus/be-searching)                                | [code](https://github.com/bahrus/be-searching/blob/baseline/be-searching.js)                                |
| be-sharing          | [Share](https://github.com/bahrus/be-sharing) values from the adorned element to peer elements.        | [code](https://github.com/bahrus/be-sharing/blob/baseline/be-sharing.js)                                    |
| be-switched         | [Lazy loads](https://github.com/bahrus/be-switched) content when conditions are met.                   | [code](https://github.com/bahrus/be-switched/blob/baseline/be-switched.js)                                  |
| be-typed            | Allow the user to customize [input](https://github.com/bahrus/be-typed) element during run time.       | [code](https://github.com/bahrus/be-typed/blob/baseline/be-typed.js)                                        |
| be-value-added      | Add a [value](https://github.com/bahrus/be-value-added) property used for formatting.                  | [code](https://github.com/bahrus/be-value-added)                                                            |
| be-valued           | Reflect [value](https://github.com/bahrus/be-valued) of input to the value attribute on input event.   | [code](https://github.com/bahrus/be-valued/blob/baseline/be-valued.js)                                      |
| be-written          | [Stream](https://github.com/bahrus/be-written) a url to a target DOM element.                          | [code](https://github.com/bahrus/be-written/blob/baseline/be-written.js)                                    |

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
const myEnhancement = await myElement.beEnhanced.whenResolved(emc);
myEnhancement.addEventListener('resolved', e => {

})
```
