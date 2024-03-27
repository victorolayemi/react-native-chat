import { StyleSheet } from 'react-native';
export default ({ theme }) => StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    input: {
        ...theme.fonts.inputTextStyle,
        color: theme.colors.inputText,
        flex: 1,
        maxHeight: 100,
        // Fixes default paddings for Android
        paddingBottom: 0,
        paddingTop: 0,
    },
    marginRight: {
        marginRight: 16,
    },
});
//# sourceMappingURL=styles.js.map