import * as React from 'react';
import { Animated, StyleSheet, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComponentSize, useKeyboardDimensions, usePanResponder, } from './hooks';
export const KeyboardAccessoryView = React.memo(({ children, contentContainerStyle, contentOffsetKeyboardClosed, contentOffsetKeyboardOpened, renderBackground, renderScrollable, scrollableContainerStyle, spaceBetweenKeyboardAndAccessoryView, style, useListenersOnAndroid, }) => {
    const { onLayout, size } = useComponentSize();
    const { keyboardEndPositionY, keyboardHeight } = useKeyboardDimensions(useListenersOnAndroid);
    const { panHandlers, positionY } = usePanResponder();
    const { bottom, left, right } = useSafeAreaInsets();
    const deltaY = Animated.subtract(positionY, keyboardEndPositionY).interpolate({
        inputRange: [0, Number.MAX_SAFE_INTEGER],
        outputRange: [0, Number.MAX_SAFE_INTEGER],
        extrapolate: 'clamp',
    });
    const offset = size.height +
        keyboardHeight +
        (keyboardHeight > 0
            ? (contentOffsetKeyboardOpened !== null && contentOffsetKeyboardOpened !== void 0 ? contentOffsetKeyboardOpened : 0) - bottom
            : contentOffsetKeyboardClosed !== null && contentOffsetKeyboardClosed !== void 0 ? contentOffsetKeyboardClosed : 0);
    return (React.createElement(React.Fragment, null,
        React.createElement(Animated.View, { style: [
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    flex: 1,
                    paddingBottom: Animated.subtract(offset, deltaY),
                },
                scrollableContainerStyle,
            ] }, renderScrollable(panHandlers)),
        React.createElement(Animated.View, { style: [
                {
                    bottom: Animated.subtract(keyboardHeight > 0
                        ? keyboardHeight + (spaceBetweenKeyboardAndAccessoryView !== null && spaceBetweenKeyboardAndAccessoryView !== void 0 ? spaceBetweenKeyboardAndAccessoryView : 0)
                        : 0, deltaY),
                },
                styles.container,
                style,
            ], testID: 'container' }, renderBackground === null || renderBackground === void 0 ? void 0 :
            renderBackground(),
            React.createElement(View, { onLayout: onLayout, style: [
                    styles.contentContainer,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                        marginBottom: keyboardHeight > 0 ? 0 : bottom,
                        marginLeft: left,
                        marginRight: right,
                    },
                    contentContainerStyle,
                ] }, children))));
});
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    contentContainer: {
        flex: 1,
    },
});
//# sourceMappingURL=KeyboardAccessoryView.js.map