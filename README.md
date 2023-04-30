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

We prefer ["decorator"](https://en.wikipedia.org/wiki/Decorator_pattern) as the term, but "[cross-cutting] [custom attribute](https://github.com/matthewp/custom-attributes)", "directive", ["behavior"](https://github.com/lume/element-behaviors) and especially "progressive enhancements" are also acceptable terms.

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
| be-a-beacon         | [Announce](https://github.com/bahrus/be-a-beacon) revival of (last) element in HTML Stream      | [code](https://github.com/bahrus/be-a-beacon/blob/baseline/be-a-beacon.ts)                        |
| be-committed        | [Trigger](https://github.com/bahrus/be-committed) a button click on keyboard "enter"            | [code](https://github.com/bahrus/be-committed/blob/baseline/be-committed.ts)                       |
| be-scoped           | Create an EventTarget associated with the adorned element that can hold [scoped](https://github.com/bahrus/be-scoped) state. | [code](https://github.com/bahrus/be-scoped/blob/baseline/be-scoped.ts)    |

## The be-enhancement api

be-enhancement commits the cardinal sin of attaching a custom property gateway, "beEnhanced" on all Elements.  Being that the platform has shown little to no interest in providing support for progressive enhancement over many decades when such solutions have proven useful, we should feel no guilt whatsoever.

Having this property gateway is a life-safe as far as performance and providing an easy of integrating enhancements into frameworks

To set a value on a namespaced property (e.g. via framework), do the following:

```JavaScript
await customElements.whenDefined('be-enhanced');
const base = myElement.beEnhanced.by.aButterBeerCounter;
Object.assign(base, {count: 7});
```

This should work just fine even if the enhancement a-butter-beer-counter hasn't loaded yet.  The enhancement will absorb the settings the moment it becomes attached to the element it is enhancing.

The intention here is even if the element hasn't been upgraded yet, property settings made this way should be absorbed into the enhancement once it becomes attached. 

## Server-rendered HTML vs Template Instantiated HTML

If the HTML we are working with is rendered by the server, the most effective way of activating the custom enhancement is via the associated attribute:

```html
<button be-counted>Count me</button>
```

However, activating enhancements via attributes is not ideal when using client side api's to build the API, such as during template instantiation.

The way to do this most effectively programmatically is:

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