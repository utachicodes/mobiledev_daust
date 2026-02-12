# MOBILE DEVELOPEMENT Course (with React Native) 
## DAUST SPRING 2026
## Lecture 1 : React Native UI & Components

[React Native Documentation](https://reactnative.dev/)
[Expo Documentation](https://docs.expo.dev/)

**Goals of the Lecture**
- Introduction to React Native
- Core Components
- Styling in React Native
- Layout with Flexbox
- Custom Components
- Exercise

---

## Part 1: Introduction to React Native

### What is React Native?

React Native is a framework for building native mobile applications using JavaScript and React. 
- Created by Meta (formerly Facebook) and open-sourced in 2015. 
- Fundamental principle "Learn once, write anywhere" - same knowledge and similar code to build applications for both iOS and Android platforms.

**Why React Native?**

Traditional mobile development requires learning different languages and frameworks: Swift/Objective-C for iOS and Java/Kotlin for Android. 

This means :
- Maintaining two separate codebases, 
- Hiring specialized developers for each platform
- Duplicating effort. 

React Native solves this by allowing developers to use JavaScript and React to build truly native mobile applications.

**Key Features:**
- Write once, run on iOS and Android with minimal platform-specific code
- Uses actual native components (not WebView like Cordova/Ionic)
- Hot reloading allows you to see changes instantly without rebuilding
- Large ecosystem with thousands of third-party libraries
- Backed by Meta with strong community support
- Ability to write native modules when needed

**How it works - The Architecture:**

React Native has a unique architecture that bridges JavaScript and native code. When you write React Native code, here's what happens:

1. **JavaScript Thread**: Your React code runs in a JavaScript thread, managing the application logic and state
2. **Bridge**: A communication layer that passes messages between JavaScript and native code asynchronously
3. **Native Threads**: Actual native UI components (UIView on iOS, View on Android) render on the native side
4. **Shadow Thread**: Calculates layout using Facebook's Yoga layout engine before committing to native

This means when you create a `<View>` component, React Native actually creates a real native UIView (iOS) or android.view.View (Android), not a web view with HTML/CSS. This is why React Native apps feel truly native - they ARE native.

---

## React Native vs React Web

| Aspect | React Native | React Web |
|--------|--------------|-----------|
| UI Elements | `<View>`, `<Text>` | `<div>`, `<span>` |
| Styling | StyleSheet object | CSS files |
| Layout | Flexbox (default) | Various (Flexbox, Grid) |
| Navigation | React Navigation, Expo Router, | React Router,... |
| Platform | iOS, Android | Browsers |

---

## Core Components Overview

React Native provides a set of built-in components:

**Container Components:**
- `View` - Basic container (like `<div>`)
- `ScrollView` - Scrollable container
- `SafeAreaView` - Respects device safe areas

**Display Components:**
- `Text` - Text display (all text must be in `<Text>`)
- `Image` - Display images
- `ImageBackground` - Background images

**Input Components:**
- `TextInput` - Text input field
- `Button` - Basic button
- `TouchableOpacity` - Touchable wrapper
- `Switch` - Toggle switch

**And many others**

[Components link]()

---

## The View Component

The most fundamental component - a container that supports layout, styling, and touch handling.

```javascript
import { View } from 'react-native';

function MyComponent() {
  return (
    <View>
      {/* Child components */}
    </View>
  );
}
```

**Common uses:**
- Layout containers
- Wrapping multiple elements
- Creating sections
- Implementing custom UI patterns

---

## The Text Component

All text must be wrapped in a `<Text>` component.

```javascript
import { Text } from 'react-native';

function MyText() {
  return (
    <Text style={{ fontSize: 18, color: '#333' }}>
      Hello, React Native!
    </Text>
  );
}
```

**Key properties:**
- `numberOfLines` - Limit lines shown
- `ellipsizeMode` - How to truncate text
- `onPress` - Make text tappable

**Nested Text:**
```javascript
<Text>
  I am bold <Text style={{ fontWeight: 'bold' }}>and red</Text>
</Text>
```

---

## The Image Component

Display images from various sources.

```javascript
import { Image } from 'react-native';

// Local image
<Image 
  source={require('./assets/logo.png')} 
  style={{ width: 100, height: 100 }}
/>

// Remote image
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
```

**Important:**
- You must specify width and height
- Use `resizeMode` prop: 'cover', 'contain', 'stretch', 'repeat', 'center'

---

## TouchableOpacity Component

Makes any component touchable with opacity feedback.

```javascript
import { TouchableOpacity, Text } from 'react-native';

function MyButton() {
  return (
    <TouchableOpacity 
      onPress={() => console.log('Pressed!')}
      activeOpacity={0.7}
      style={{ padding: 15, backgroundColor: '#007AFF' }}
    >
      <Text style={{ color: 'white' }}>Press Me</Text>
    </TouchableOpacity>
  );
}
```

**Other touchable components:**
- `TouchableHighlight` - Darkens on press
- `TouchableWithoutFeedback` - No visual feedback
- `Pressable` - Modern, more flexible option

---

## TextInput Component

Allows user text input.

```javascript
import { TextInput } from 'react-native';
import { useState } from 'react';

function MyInput() {
  const [text, setText] = useState('');
  
  return (
    <TextInput
      value={text}
      onChangeText={setText}
      placeholder="Enter text here"
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5
      }}
    />
  );
}
```

**Common props:**
- `keyboardType` - 'default', 'numeric', 'email-address', etc.
- `secureTextEntry` - For passwords
- `multiline` - Allow multiple lines

---

## Styling in React Native

### StyleSheet API

The recommended way to style components.

```javascript
import { StyleSheet, View, Text } from 'react-native';

function StyledComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

**Benefits:**
- Performance optimization
- Code validation
- Better organization

---

## Inline Styles vs StyleSheet

**Inline Styles:**
```javascript
<View style={{ padding: 10, backgroundColor: 'blue' }}>
```

**StyleSheet:**
```javascript
<View style={styles.container}>

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: 'blue' }
});
```

It is possible to have multiple or conditional styles in a component

**Multiple Styles:**
```javascript
<View style={[styles.container, styles.shadow, { marginTop: 20 }]}>
```

**Conditional Styles:**
```javascript
<View style={[styles.box, isActive && styles.activeBox]}>
```

---

## Common Style Properties

**Layout:**
- `width`, `height`, `margin`, `padding`
- `flex`, `flexDirection`, `justifyContent`, `alignItems`

**Visual:**
- `backgroundColor`, `opacity`
- `borderWidth`, `borderColor`, `borderRadius`

**Text:**
- `fontSize`, `fontWeight`, `color`
- `textAlign`, `lineHeight`, `letterSpacing`

**Positioning:**
- `position` - 'relative' or 'absolute'
- `top`, `right`, `bottom`, `left`
- `zIndex`

**Note:** No units needed for most values. Numbers default to density-independent pixels (dp).

---

## Flexbox Layout

Flexbox is the primary layout system in React Native.

**Main Concepts:**
- **Main Axis** - Primary direction (row or column)
- **Cross Axis** - Perpendicular to main axis
- **flex** - How much space component should take

```javascript
<View style={{ flex: 1, flexDirection: 'row' }}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 2, backgroundColor: 'blue' }} />
</View>
```

**Default behavior:**
- `flexDirection: 'column'` (unlike web which is 'row')
- `alignItems: 'stretch'`
- `flexShrink: 1`

---

## Flexbox Properties

**Container Properties:**

```javascript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // or 'column', 'row-reverse', 'column-reverse'
    justifyContent: 'center', // main axis alignment
    alignItems: 'center', // cross axis alignment
    flexWrap: 'wrap', // or 'nowrap'
  }
});
```

**justifyContent values:**
- `flex-start`, `flex-end`, `center`
- `space-between`, `space-around`, `space-evenly`

**alignItems values:**
- `flex-start`, `flex-end`, `center`
- `stretch`, `baseline`

---

## Flexbox Examples

**Center content:**
```javascript
<View style={{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}}>
  <Text>Centered!</Text>
</View>
```

**Three equal columns:**
```javascript
<View style={{ flexDirection: 'row', flex: 1 }}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 1, backgroundColor: 'green' }} />
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
</View>
```

**Header, content, footer:**
```javascript
<View style={{ flex: 1 }}>
  <View style={{ height: 60, backgroundColor: '#007AFF' }} />
  <View style={{ flex: 1, backgroundColor: '#f5f5f5' }} />
  <View style={{ height: 50, backgroundColor: '#007AFF' }} />
</View>
```

---

## ScrollView Component

For scrollable content that doesn't fit on screen.

```javascript
import { ScrollView, Text } from 'react-native';

function MyScrollView() {
  return (
    <ScrollView>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      {/* Many more items */}
    </ScrollView>
  );
}
```

**Key props:**
- `horizontal` - Scroll horizontally
- `showsVerticalScrollIndicator` - Show/hide scrollbar
- `contentContainerStyle` - Style the content container

**When to use:**
- Known, small amount of content
- For large lists, use `FlatList` instead

---

## Custom Components

Creating reusable components is essential for maintainable code.

**Simple Custom Component:**
```javascript
function Card({ title, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});
```

---

## Component Composition

Build complex UIs by combining simple components.

```javascript
function UserProfile({ user }) {
  return (
    <View style={styles.profile}>
      <Avatar source={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
      <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
    </View>
  );
}

function Avatar({ source }) {
  return (
    <Image source={source} style={styles.avatar} />
  );
}

function UserInfo({ name, email }) {
  return (
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}
```

**Benefits:**
- Reusability
- Easier testing
- Better organization
- Separation of concerns

---

## Best Practices

**Component Design:**
- Keep components small and focused
- Use props for configuration
- Extract reusable parts
- Follow single responsibility principle

**Styling:**
- Use StyleSheet.create() for better performance
- Create a theme/constants file for colors and sizes
- Consider creating style utilities

**Performance:**
- Avoid inline functions in render (use useCallback)
- Memoize expensive components (React.memo)
- Use FlatList for long lists, not ScrollView

**Code Organization:**
- One component per file (usually)
- Group related components in folders
- Separate styles from component logic
