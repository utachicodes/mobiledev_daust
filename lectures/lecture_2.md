# MOBILE DEVELOPEMENT Course (with React Native) 
## DAUST SPRING 2026
## Lecture 2 : Styling in React Native

React Native uses a JavaScript-based styling approach that differs significantly from traditional CSS:

**Differences:**

- **No CSS files**: Styles are written in JavaScript objects
- **Subset of CSS properties**: Not all CSS properties are available
- **Camel case naming**: Properties use camelCase instead of kebab-case
- **Numeric values**: Most values are unitless numbers (not px, em, rem)
- **Flexbox by default**: All containers use Flexbox layout
- **No cascade**: Styles don't cascade like in CSS
- Styles are defined using **JavaScript objects** and applied via the `style` prop.

---

## How Styling is applied 

It is possible to style components inline directly or use Stylesheet API

* **Inline styles**:

  ```jsx
  <View style={{ backgroundColor: 'red', padding: 10 }} />
  ```
Inline Styling can used in these scenarios
- Quick prototyping
- Dynamic styles based on props or state
- One-off customizations

The other alternative is the StyleSheet API
* **StyleSheet** (recommended):

  ```jsx
  const styles = StyleSheet.create({ container: { backgroundColor: 'red' } });
  <View style={styles.container} />
  ```
* StyleSheet improves **performance** and **reusability**.
---

## StyleSheet API

StyleSheet is an abstraction similar to CSS StyleSheets that allows us to define styles for components in a more organized and performant way. 

With StyleSheet.create(), the style object is sent through the "bridge" to the native side only once, referencing it by ID.

There is no need to recreate objects on every render.


```javascript
const styles = StyleSheet.create({
  container: {
    // default container styles here
  }
});
```

### Why StyleSheet API?

The StyleSheet API provides several benefits:

1. **Validation**: Catches typos and errors during development
2. **Performance**: Styles are sent to native side only once
3. **Code organization**: Separates styling from component logic
4. **Optimization**: Enables React Native to optimize rendering

### Important Core API Methods
- [ ] **create()**: Define the styles.
  *Example:* `const styles = StyleSheet.create({ container: { flex: 1 } });`
- [ ] **flatten()**: Flattens an array of style objects into one.
  *Use Case:* Merging multiple styles into a single object.
- [ ] **compose()**: Combines two styles (style2 overrides style1).

React Native allows style composition using arrays as well :

```javascript
const MyComponent = ({ isActive, isHighlighted }) => {
  return (
    <View >
      <Text style={[styles.baseText, styles.boldText]}>
        Composed Styles
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: '700',
  },
});
```

**Important:** Later styles in the array override earlier ones.


### Common Style Properties

#### Text Properties

```javascript
const textStyles = StyleSheet.create({
  text: {
    // Font properties
    fontFamily: 'Arial', // Platform-specific fonts
    fontSize: 16,
    fontWeight: '400', // '100' to '900', 'normal', 'bold'
    fontStyle: 'normal', // 'normal', 'italic'
    lineHeight: 24,
    letterSpacing: 0.5,
    
    // Color and decoration
    color: '#000000',
    textDecorationLine: 'none', // 'none', 'underline', 'line-through'
    textDecorationStyle: 'solid', // 'solid', 'double', 'dotted', 'dashed'
    textDecorationColor: '#000',
    
    // Alignment
    textAlign: 'left', // 'auto', 'left', 'right', 'center', 'justify'
    textAlignVertical: 'auto', // 'auto', 'top', 'bottom', 'center' (Android)
    
    // Transform
    textTransform: 'none', // 'none', 'uppercase', 'lowercase', 'capitalize'
    
    // Shadow (iOS)
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
```

#### View Properties

```javascript
const viewStyles = StyleSheet.create({
  view: {
    // Dimensions
    width: 100,
    height: 100,
    minWidth: 50,
    minHeight: 50,
    maxWidth: 200,
    maxHeight: 200,
    
    // Background
    backgroundColor: '#ffffff',
    opacity: 1, // 0 to 1
    
    // Borders
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    borderStyle: 'solid', // 'solid', 'dotted', 'dashed'
    
    // Individual borders
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    
    borderTopColor: '#000',
    borderRightColor: '#000',
    borderBottomColor: '#000',
    borderLeftColor: '#000',
    
    // Individual border radius
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    
    // Padding
    padding: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    
    // Margin
    margin: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    // Elevation (Android)
    elevation: 5,
    
    // Transform
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: '45deg' },
      { scale: 1.5 },
      { scaleX: 1.5 },
      { scaleY: 1.5 },
      { skewX: '45deg' },
      { skewY: '45deg' },
    ],
  },
});
```

##  Layout with Flexbox (Refresher)

 React Native uses **Flexbox** by default for layout.
 There is no need for `display: flex`; containers automatically behave like flex containers.

Flexbox has the following Main Concepts :

* `flexDirection`: direction of children (`column` default, `row`, etc.).
* `justifyContent`: alignment along main axis (e.g., `center`, `space-between`).
* `alignItems`: alignment along cross axis (e.g., `center`, `stretch`).

---

## Example: Flexbox Layout

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
```
This evenly spaces children horizontally with equal spacing. 

---

##  Responsive Design in React Native

Mobile apps like web applications have to adapty on different screen sizes and orientations.

React Native does not have CSS media queries — but we can use Flexbox + relative units, percentages, and APIs to handle responsiveness.

We can leverage different tools at our disposal:

1. **The Dimensions API**: For getting screen measurements
2. **useWindowDimensions Hook**: For responsive components
3. **Percentage-based sizing**: For proportional layouts
4. **Aspect Ratio**: For maintaining proportions

---

###  Dimensions API

[Dimensions](https://reactnative.dev/docs/dimensions) Provides screen width & height.

```jsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
```

* Useful for conditionally styling based on screen size (e.g., tablet vs phone).

Although dimensions are available immediately, they may change (e.g due to device rotation, foldable devices etc) so any rendering logic or styles that depend on these constants should try to call this function on every render, rather than caching the value 

(for example, using inline styles rather than setting a value in a StyleSheet).

---

### `useWindowDimensions` Hook


[useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions) is  more dynamic Dimensions API that responds to orientation changes.

It is the preferred API for React components.

Unlike Dimensions, it updates as the window's dimensions update.

Example:

```jsx
import { useWindowDimensions } from 'react-native';

const { width, height } = useWindowDimensions();
//...
```

---

### Percentage and Relative Units
Percentage and Relative units ensure elements scale proportionally.

It is advised to use relative values where possible

```jsx
<View style={{ width: '80%', height: '50%' }} />
```

---

### Aspect Ratio

The `aspectRatio` property lets us  maintain proportions without calculating heights manually. 

Whatever the width is, the  height maintain this ratio.

For example it helps with responsive image/video layouts.

```jsx
style={{ aspectRatio: 16 / 9 }}
```

---

## Platform-Specific Styling



iOS and Android have different design languages, different user expectations, and different technical capabilities. 

Mobile developers need to respect these differences while maintaining a consistent brand experience.

For example

1. **Shadows**: iOS uses `shadow*` properties, Android uses `elevation`
2. **Status Bar Height**: The notch, dynamic island, etc.
3. **Font Rendering**: Different default fonts and rendering engines
4. **Interaction Patterns**: Different conventions for buttons, gestures, etc.


React Native provides a module ([`Platform`](https://reactnative.dev/docs/platform-specific-code)) that detects the platform in which the app is running.

We can leverage the `Platform` module to apply **iOS vs Android** styles. 

Example :

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
```

---

##  `Platform.select` for Cleaner Code

It is possible to leverage the `Platform.select` for group-based styling:

```jsx
...Platform.select({
  ios: { shadowColor: '#000' },
  android: { elevation: 5 },
})
```

This can be ideal for platform-specific shadows or effects.

[Platform-specific code](https://reactnative.dev/docs/platform-specific-code)
---

##  Platform Version Checking
A platform (Android, iOs,...) has different versions and similarly we can adapt our code or styles to those different versions.

Example :
```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // Use newer API only on supported versions
    ...(Platform.Version >= 21 && {
      elevation: 10,
    }),
  },
  
  text: {
    // Check iOS version
    ...(Platform.OS === 'ios' && Platform.Version >= '14' && {
      fontVariant: ['small-caps'],
    }),
  },
});
```

##  Safe Area 

The purpose of `SafeAreaView` is to render content within the safe area boundaries of a device.

- The old `SafeAreaView` API has been deprecated in favor of the  [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/) library
provides a flexible API for accessing device safe area inset information.
- It allows us to position the content appropriately around notches, status bars, home indicators, and other such device and operating system interface elements.
- It also provides a `SafeAreaView` component.



## Third-Party Styling Libraries

There are many third-party styling libraries available for React Native. Some of the most popular ones are:

###  Styled Components

Popular CSS-in-JS library for React Native:

```bash
npm install styled-components
```

###  NativeWind (Tailwind CSS for React Native)

Tailwind CSS utility classes for React Native:

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

### Tamagui

High-performance styling library with design system:

```bash
npm install tamagui @tamagui/core
```

### React Native Paper

Material Design component library:

```bash
npm install react-native-paper
```

---

## Summary and Key Takeaways

### Core Concepts
1. React Native uses JavaScript-based styling, not traditional CSS
2. StyleSheet.create() provides performance benefits and validation
3. Flexbox is the default layout system (with some differences from web)
4. Dimensions and responsive design require special consideration
5. Platform-specific styling handles iOS vs Android differences

### Best Practices Checklist
- ✅ Use StyleSheet.create() instead of inline styles
- ✅ Organize styles in separate files or at the bottom of components
- ✅ Create centralized theme with colors, spacing, and typography
- ✅ Use semantic naming conventions for styles
- ✅ Avoid magic numbers, use theme constants
- ✅ Leverage style composition with arrays
- ✅ Use useMemo for complex dynamic styles
- ✅ Enable useNativeDriver for animations
- ✅ Test on both iOS and Android
- ✅ Consider accessibility (font scaling, color contrast)

### Common Pitfalls to Avoid
- ❌ Don't recreate style objects on every render
- ❌ Don't use web CSS properties that don't exist in React Native
- ❌ Don't forget platform-specific styling differences
- ❌ Don't ignore responsive design considerations
- ❌ Don't hardcode values, use theme constants
- ❌ Don't use transforms for layout, use flexbox
- ❌ Don't forget to test on real devices

## Thanks